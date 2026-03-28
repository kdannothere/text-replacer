import { ViewMode } from "@/components/ui/Settings"
import { getStorage, reloadApp, setStorage } from "@/lib/utils"
import { findAndReplaceText } from "@/scripts/findAndReplaceText"
import browser from "webextension-polyfill"

export const COMMAND = {
  START_ACTION: "start_action",
} as const

export type CommandName = (typeof COMMAND)[keyof typeof COMMAND]

browser.runtime.onInstalled.addListener(() => reloadApp())

async function applyViewMode(): Promise<void> {
  try {
    const storage = await getStorage()
    const viewMode = storage.viewMode ?? ViewMode.SIDEPANEL
    const isSidePanel = viewMode == ViewMode.SIDEPANEL
    await (browser as any).sidePanel.setPanelBehavior({
      openPanelOnActionClick: isSidePanel,
    })
  } catch (e) {
    console.error("SidePanel API not supported or error:", e)
  }
}

await applyViewMode()

browser.runtime.onMessage.addListener(async (message: unknown) => {
  if (message === "start_action") {
    const storage = await getStorage()
    if (storage.status === "ON") {
      console.warn("Previous work is not finished yet...")
      return
    }
    await handlePerformSingleAction()
  }
  console.error("UNKNOWN_COMMAND")
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
      const textToFind = storage.textToFind ?? ""
      const textToReplaceWith = storage.textToReplaceWith ?? ""
      await browser.scripting
        .executeScript({
          target: { tabId: tab.id as number },
          func: findAndReplaceText,
          args: [textToFind, textToReplaceWith],
        })
        .then(async (result) => {
          const data = result[0].result
          if (data !== undefined) {
            // data.data && (await addToLog(data.data + "\n"));
            // data.error && (await addToLog(data.error + "\n"));
          } else {
            throw new Error(`Something went wrong.`)
          }
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
  }
}
