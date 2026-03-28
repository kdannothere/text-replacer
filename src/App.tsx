import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import CustomSelect from "./components/ui/inputs/CustomSelect"
import ReplaceText from "./components/ui/ReplaceText"
import useBrowserStorage from "./components/ui/useBrowserStorage"
import { getStorage, sendMessage, setStorage } from "./lib/utils"
import { COMMAND } from "./background"

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
        <header className="mb-5 flex items-center">
          <h1 className="m-0 text-[1.5em] font-bold text-[#2c3e50]">
            Extension Tool
          </h1>
        </header>

        {/* Input Group */}
        <div className="mb-[15px] flex flex-col">
          <label className="mb-[5px] cursor-default font-bold">Menu</label>
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
          {activeView === "settings" && (
            <div className="flex flex-col items-center justify-center p-4">
              <Settings className="h-8 w-8 text-gray-600" />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
