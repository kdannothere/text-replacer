import { reloadApp } from "@/lib/utils"
import SwitchComponent from "./inputs/SwitchComponent"
import useBrowserStorage from "./useBrowserStorage"

export enum ViewMode {
  POPUP,
  SIDEPANEL,
}

const Settings = () => {
  const [viewMode, setViewMode] = useBrowserStorage(
    "viewMode",
    ViewMode.SIDEPANEL
  )

  const handleViewModeChange = () => {
    reloadApp()
  }

  return (
    <div id="settings" className="view active-view">
      <div
        style={{
          marginBlock: "16px",
          background: "#bbe9b2bf",
          paddingBlock: "16px",
          paddingInline: "8px",
          borderRadius: "8px",
        }}
      >
        <p
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "1rem",
            fontWeight: "600",
          }}
        >
          <span>
            <SwitchComponent
              id={"viewModeSwitch"}
              state={viewMode == ViewMode.SIDEPANEL}
              setState={async () => {
                viewMode == ViewMode.SIDEPANEL
                  ? setViewMode(ViewMode.POPUP)
                  : setViewMode(ViewMode.SIDEPANEL)
                handleViewModeChange()
              }}
            />
          </span>
          <span>Side panel view</span>
        </p>
      </div>
    </div>
  )
}

export default Settings
