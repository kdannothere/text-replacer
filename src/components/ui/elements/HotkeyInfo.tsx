import { useState } from "react"
import { Info, ChevronDown, ChevronUp } from "lucide-react"

export default function HotkeyInfo() {
  const [showHotkey, setShowHotkey] = useState(false)

  return (
    <div className="mb-4">
      <button
        onClick={() => setShowHotkey(!showHotkey)}
        className="flex cursor-pointer items-center gap-1.5 text-xs font-bold tracking-wider text-[#2c3e50]/60 uppercase transition-colors hover:text-[#46b51e]"
      >
        <Info size={14} />
        Hotkey
        {showHotkey ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {showHotkey && (
        <div className="mt-2 animate-in duration-200 fade-in slide-in-from-top-1">
          <p className="rounded-lg bg-white/50 p-3 text-sm shadow-sm outline outline-[#bbe9b2]">
            <p>
              By default:{" "}
              <span className="font-semibold text-[#2c3e50]">Ctrl+Shift+Z</span>
            </p>
            <p>
              Mac device:{" "}
              <span className="font-semibold text-[#2c3e50]">
                Command+Shift+Z
              </span>
            </p>
          </p>
        </div>
      )}
    </div>
  )
}
