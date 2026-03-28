interface SwitchComponentProps {
  state: boolean
  setState: (state: boolean) => void
  id: string
}

export default function SwitchComponent({
  id,
  state,
  setState,
}: SwitchComponentProps) {
  const handleToggle = () => {
    setState(!state)
  }

  return (
    <div style={{ scale: "0.8" }}>
      <label className="switch" htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          checked={state}
          onChange={handleToggle}
        />
        <span className="slider round"></span>
      </label>
    </div>
  )
}
