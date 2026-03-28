import { useState, useRef, useEffect } from "react"

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="custom-select" ref={selectRef}>
      <div className="select-selected" onClick={() => setIsOpen(!isOpen)}>
        {options.find((option) => option.value === value)?.label}
      </div>
      {isOpen && (
        <div className="select-items">
          {options.map((option) => (
            <div
              key={option.value}
              className="select-item"
              style={{ backgroundColor: "#ffffffff" }}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
