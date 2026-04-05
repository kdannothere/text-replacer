import { useRef } from "react"
import { CustomButton } from "../inputs/CustomButton"
import useBrowserStorage from "../utils/useBrowserStorage"
import { Plus, Download, Upload } from "lucide-react"
import type { ReplacementPair } from "../elements/ReplacementPairItem"
import ReplacementPairItem from "../elements/ReplacementPairItem"
import HotkeyInfo from "../elements/HotkeyInfo"

interface ReplaceTextProps {
  handleStart: () => Promise<void>
}

// Helper to generate a fresh pair
const createEmptyPair = (): ReplacementPair => ({
  id: crypto.randomUUID(),
  find: "",
  replace: "",
})

export default function ReplaceText({ handleStart }: ReplaceTextProps) {
  // Store an array of pairs instead of individual strings
  const [pairs, setPairs] = useBrowserStorage<ReplacementPair[]>(
    "replacementPairs",
    [createEmptyPair()]
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- CRUD Operations ---
  const handleAddPair = () => {
    setPairs([...pairs, createEmptyPair()])
  }

  const updatePair = (
    id: string,
    field: keyof ReplacementPair,
    value: string
  ) => {
    setPairs(pairs.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const removePair = (id: string) => {
    setPairs(pairs.filter((p) => p.id !== id))
  }

  const handleReset = () => {
    setPairs([createEmptyPair()])
  }

  // --- JSON Export ---
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(pairs, null, 2)
    const blob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `replace-pairs-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // --- JSON Import ---
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string)

        // Basic validation to ensure it's an array
        if (Array.isArray(importedData)) {
          // Re-assign IDs to prevent conflicts, ensure fields exist
          const validPairs = importedData.map((item: any) => ({
            id: crypto.randomUUID(),
            find: item.find || "",
            replace: item.replace || "",
          }))
          setPairs(validPairs)
        } else {
          alert("Invalid file format. Must be an array of replacement pairs.")
        }
      } catch (error) {
        alert("Error reading JSON file.")
      }
    }
    reader.readAsText(file)

    // Reset file input so the same file can be uploaded again if needed
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="flex animate-in flex-col gap-4 duration-300 fade-in">
      {/* Primary Actions */}
      <div className="flex gap-2">
        <CustomButton
          className="flex-1 cursor-pointer bg-[#46b51e] text-white hover:bg-[#ffc800]"
          onClick={handleStart}
        >
          Start
        </CustomButton>
        <CustomButton
          className="flex-1 cursor-pointer bg-[#c06ab7] text-white hover:bg-[#ffc800]"
          onClick={handleReset}
        >
          Reset All
        </CustomButton>
      </div>

      {/* Pairs Container */}
      <div className="rounded-2xl bg-[#bde9a2] p-4 shadow-inner">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-bold text-[#2c3e50]">Replacement Pairs</h2>

          {/* Import/Export Tools */}
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="flex cursor-pointer items-center gap-1 rounded bg-white/50 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-white"
            >
              <Download size={14} /> Export
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center gap-1 rounded bg-white/50 px-2 py-1 text-xs font-semibold text-gray-700 hover:bg-white"
            >
              <Upload size={14} /> Import
            </button>
            {/* Hidden file input */}
            <input
              type="file"
              accept=".json"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImportJSON}
            />
          </div>
        </div>
        <HotkeyInfo />

        {/* Dynamic List of Pairs */}
        <div className="flex flex-col overflow-y-auto pr-1">
          {pairs.map((pair) => (
            <ReplacementPairItem
              key={pair.id}
              pair={pair}
              updatePair={updatePair}
              removePair={removePair}
              isRemovable={pairs.length > 1} // Prevent removing the very last pair
            />
          ))}
        </div>

        {/* Add Pair Button */}
        <button
          onClick={handleAddPair}
          className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#8ec775] bg-[#cde9bb]/50 py-2 font-semibold text-[#5a8a46] transition-colors hover:bg-[#d9e8cf]"
        >
          <Plus size={18} /> Add Another Pair
        </button>
      </div>
    </div>
  )
}
