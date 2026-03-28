import { createManifest } from "@bedframe/core"
import { baseManifest } from "./index"

const chrome = createManifest(
  {
    manifest_version: 3,
    name: baseManifest.name,
    version: baseManifest.version,
    description: baseManifest.description,
    icons: baseManifest.icons,
    permissions: ["activeTab", "scripting", "storage", "sidePanel"],
    host_permissions: ["<all_urls>"],
    commands: baseManifest.commands,
    action: baseManifest.action,
    background: {
        service_worker: "src/background/index.ts",
        type: "module",
    },
    side_panel: {
        default_path: "index.html",
    },
  },
  "chrome"
)

export default chrome
