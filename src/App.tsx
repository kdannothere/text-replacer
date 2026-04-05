import { useState, useEffect } from "react"
import CustomSelect from "./components/ui/inputs/CustomSelect"
import ReplaceText from "./components/ui/pages/ReplaceText"
import useBrowserStorage from "./components/ui/utils/useBrowserStorage"
import { getStorage, sendMessage, setStorage } from "./lib/utils"
import { COMMAND } from "./background"
import Settings from "./components/ui/pages/Settings"

type View = "settings" | "findAndReplaceText"

const App = () => {
  const [activeView, setActiveView] = useBrowserStorage<View>(
    "lastActiveViewId",
    "findAndReplaceText"
  )
  const [status, setStatus] = useState("")
  const [queue, setQueue] = useState("")
  const [log, setLog] = useState("")

  useEffect(() => {
    const realTimeStatusUpdate = async () => {
      const storage = await getStorage()
      const newStatus = (storage.status as string) ?? "OFF"
      const newQueue = (storage.queue as string) ?? ""
      const newLog = (storage.log as string) ?? ""

      setStatus((prevStatus) =>
        newStatus !== prevStatus ? newStatus : prevStatus
      )
      setQueue((prevQueue) => (newQueue !== prevQueue ? newQueue : prevQueue))
      setLog((prevLog) => (newLog !== prevLog ? newLog : prevLog))
    }

    realTimeStatusUpdate()
    const interval = setInterval(realTimeStatusUpdate, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleViewChange = (viewId: string) => {
    setStorage({ status: "OFF" })
    setActiveView(viewId as View)
  }

  const handleStart = async () => {
    await sendMessage(COMMAND.START_ACTION)
  }

  const viewOptions = [
    { value: "findAndReplaceText", label: "Replace text" },
    { value: "settings", label: "Settings" },
  ]

  return (
    <div className="min-h-screen min-w-[250px] bg-[#f4f4f4] p-2 font-sans text-[14px] text-[#000000] antialiased">
      <div className="flex w-full flex-col flex-nowrap">
        {/* Input Group */}
        <div className="group mb-[15px] flex flex-col">
          <label className="mb-[5px] cursor-default text-[12px] font-bold tracking-wider text-[#2c3e50]/70 uppercase transition-colors group-focus-within:text-[#c06ab7]">
            Menu
          </label>
          <CustomSelect
            options={viewOptions}
            value={activeView}
            onChange={handleViewChange}
          />
        </div>

        {/* Views */}
        <main>
          {activeView === "findAndReplaceText" && (
            <ReplaceText handleStart={handleStart} />
          )}
          {activeView === "settings" && <Settings />}
        </main>
      </div>
    </div>
  )
}

export default App
