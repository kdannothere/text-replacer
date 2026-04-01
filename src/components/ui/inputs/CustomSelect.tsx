import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface CustomSelectProps {
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export default function CustomSelect({
  options,
  value,
  onChange,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative w-full bg-white" ref={selectRef}>
      {/* Selected Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between rounded border border-[#ddd] bg-white p-2 text-[14px] shadow-sm transition-colors hover:bg-[#eceaea]"
      >
        <span>{options.find((option) => option.value === value)?.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown Items */}
      {isOpen && (
        <div className="absolute z-[99] mt-1 max-h-[200px] w-full overflow-y-auto rounded-b border border-[#f4f2f2] bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`cursor-pointer p-2 transition-colors hover:bg-[#c7dbdc] ${
                value === option.value ? "bg-[#f4f4f4] font-medium" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
