import { reloadApp, sendMessage } from "@/lib/utils"
import SwitchComponent from "../inputs/SwitchComponent"
import useBrowserStorage from "../utils/useBrowserStorage"
import { COMMAND } from "@/background"

export enum ViewMode {
  POPUP,
  SIDEPANEL,
}

const Settings = () => {
  const [viewMode, setViewMode] = useBrowserStorage(
    "viewMode",
    ViewMode.SIDEPANEL
  )

  const handleToggleView = () => {
    const nextMode =
      viewMode === ViewMode.SIDEPANEL ? ViewMode.POPUP : ViewMode.SIDEPANEL

    setViewMode(nextMode)
    reloadApp()
  }

  return (
    <div className="flex animate-in flex-col p-2 duration-300 fade-in">
      <div className="my-2 rounded-lg bg-[#bbe9b2]/75 px-3 py-4 shadow-sm">
        <label
          htmlFor="viewModeSwitch"
          className="flex cursor-pointer items-center gap-4 font-semibold text-[#2c3e50]"
        >
          <SwitchComponent
            id="viewModeSwitch"
            state={viewMode === ViewMode.SIDEPANEL}
            setState={handleToggleView}
          />
          <span className="select-none">Side panel view</span>
        </label>
      </div>

      <p className="px-1 text-xs text-gray-500">
        Changes will take effect after the extension reloads.
      </p>
    </div>
  )
}

export default Settings
