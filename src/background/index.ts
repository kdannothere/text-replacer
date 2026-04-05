import { ViewMode } from "@/components/ui/pages/Settings"
import { getStorage, setStorage } from "@/lib/utils"
import {
  findAndReplaceTextPairs,
  type Result,
} from "@/scripts/findAndReplaceText"
import browser from "webextension-polyfill"

export const COMMAND = {
  START_ACTION: "START_ACTION",
  CHANGE_VIEW_MODE: "CHANGE_VIEW_MODE",
} as const

export type CommandName = (typeof COMMAND)[keyof typeof COMMAND]

async function updateActionBehavior(viewMode: any) {
  try {
    const isSidePanel = viewMode === ViewMode.SIDEPANEL
    await (browser as any).sidePanel.setPanelBehavior({
      openPanelOnActionClick: isSidePanel,
    })
    console.log(
      `Action behavior updated: ${isSidePanel ? "Side Panel" : "Popup"}`
    )
  } catch (e) {
    console.error("SidePanel API error:", e)
  }
}

browser.runtime.onInstalled.addListener(async () => {
  const storage = await getStorage()
  const viewMode: ViewMode =
    (storage.viewMode as ViewMode) ?? ViewMode.SIDEPANEL
  updateActionBehavior(viewMode)
})

browser.storage.onChanged.addListener(async (changes, area) => {
  if (area === "local" && changes.viewMode) {
    updateActionBehavior(changes.viewMode.newValue)
  }
})

async function executeByCommand(command: string) {
  if (command === COMMAND.START_ACTION) {
    const storage = await getStorage()
    if (storage.status === "ON") {
      console.warn("Previous work is not finished yet...")
      return
    }
    handlePerformSingleAction()
    return true
  }
  console.error("UNKNOWN_COMMAND:", command)
}

browser.commands.onCommand.addListener(async (command: string) => {
  executeByCommand(command)
})

browser.runtime.onMessage.addListener(async (message: any) => {
  executeByCommand(message?.command ?? "UNKNOWN_COMMAND")
})

async function handlePerformSingleAction(): Promise<void> {
  console.log("Action started: handlePerformSingleAction")
  await setStorage({ status: "ON" })
  try {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    })

    if (!tab || !tab.id) {
      throw new Error("Error: Could not get active tab.\n")
    }

    const storage = await getStorage()
    const feature = storage.lastActiveViewId || "findAndReplaceText"

    if (feature === "findAndReplaceText") {
      const pairs = storage.replacementPairs ?? []
      await browser.scripting
        .executeScript({
          target: { tabId: tab.id as number },
          func: findAndReplaceTextPairs,
          args: [pairs],
          world: "MAIN",
        })
        .then((result) => {
          // result[0].result is the array returned by findAndReplaceTextPairs
          const data = result[0].result as Result[] | null | undefined

          if (!data || !Array.isArray(data)) {
            throw new Error(`Something went wrong: No data returned.`)
          }

          // Check if any result in the array contains an error
          const errors = data
            .filter((item) => item.error)
            .map((item) => item.error)

          if (errors.length > 0) {
            throw new Error(`Errors occurred: ${errors.join("; ")}`)
          }

          console.log("Success! Processed pairs:", data.length)
        })
        .catch((error) => {
          throw new Error(`${error.message ? error.message : error}`)
        })
    } else {
      throw new Error(`Unknown feature: ${feature}`)
    }
  } catch (error: any) {
    const errorMessage = error?.message || error
    console.error(errorMessage)
  } finally {
    await setStorage({ status: "OFF" })
    console.log("Action finished: handlePerformSingleAction")
  }
}
