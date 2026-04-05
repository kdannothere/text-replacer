import { Trash2 } from "lucide-react"

export interface ReplacementPair {
  id: string
  find: string
  replace: string
}

interface ReplacementPairItemProps {
  pair: ReplacementPair
  updatePair: (id: string, field: keyof ReplacementPair, value: string) => void
  removePair: (id: string) => void
  isRemovable: boolean
}

export default function ReplacementPairItem({
  pair,
  updatePair,
  removePair,
  isRemovable,
}: ReplacementPairItemProps) {
  return (
    <div className="relative mb-3 flex flex-col gap-2 rounded-xl bg-[#cde9bb] p-3 shadow-sm sm:flex-row sm:items-end">
      {/* Find Input */}
      <div className="flex-1">
        <label
          className="mb-1 block text-xs font-semibold text-black"
          htmlFor={`find-${pair.id}`}
        >
          Text to find
        </label>
        <input
          id={`find-${pair.id}`}
          placeholder="e.g. Green apple"
          type="text"
          className="w-full rounded-lg bg-white px-2 py-1.5 text-sm outline outline-1 outline-gray-400 focus:outline-2 focus:outline-[#46b51e]"
          value={pair.find}
          onChange={(e) => updatePair(pair.id, "find", e.target.value)}
        />
      </div>

      {/* Replace Input */}
      <div className="flex-1">
        <label
          className="mb-1 block text-xs font-semibold text-black"
          htmlFor={`replace-${pair.id}`}
        >
          Replace with
        </label>
        <input
          id={`replace-${pair.id}`}
          placeholder="e.g. Yellow apple"
          type="text"
          className="w-full rounded-lg bg-white px-2 py-1.5 text-sm outline outline-1 outline-gray-400 focus:outline-2 focus:outline-[#46b51e]"
          value={pair.replace}
          onChange={(e) => updatePair(pair.id, "replace", e.target.value)}
        />
      </div>

      {/* Remove Button */}
      {isRemovable && (
        <button
          onClick={() => removePair(pair.id)}
          className="flex h-[32px] w-[32px] shrink-0 cursor-pointer items-center justify-center rounded-lg bg-red-100 text-red-600 transition-colors hover:bg-red-500 hover:text-white"
          title="Remove pair"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  )
}
