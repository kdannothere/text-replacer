import pkg from "../../package.json"

export const baseManifest = {
  name: "Text Replacer",
  version: pkg.version,
  description: pkg.description,
  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  commands: {
    START_ACTION: {
      suggested_key: {
        default: "Ctrl+Shift+Z",
        mac: "Command+Shift+Z",
      },
      description: "Perform text replacement.",
    },
    switch_mode: {
      suggested_key: {
        default: "Ctrl+Shift+S",
        mac: "Command+Shift+S",
      },
      description: "Switch between modes.",
    },
  },
  action: {
    default_popup: "index.html",
    default_icon: {
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png",
    },
    default_title: "Open side panel",
  },
}
