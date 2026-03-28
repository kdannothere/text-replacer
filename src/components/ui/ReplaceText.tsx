import useBrowserStorage from "./useBrowserStorage"

interface ReplaceTextProps {
  handleStart: () => Promise<void>
}

export default function ReplaceText({ handleStart }: ReplaceTextProps) {
  const [textToFind, setTextToFind] = useBrowserStorage("textToFind", "")
  const [textToReplaceWith, setTextToReplaceWith] = useBrowserStorage(
    "textToReplaceWith",
    ""
  )

  const handleReset = () => {
    setTextToFind("")
    setTextToReplaceWith("")
  }

  return (
    <div id="ReplaceText" className="view active-view">
      <button
        id="startButton"
        className="action-button start-button"
        onClick={handleStart}
      >
        Start
      </button>
      <button
        id="resetButton"
        className="action-button reset-button"
        onClick={handleReset}
      >
        Reset
      </button>
      <div className="my-4 rounded-2xl bg-[#bde9a2ff] p-4">
        <div className="input-group">
          <div className="m-1 mb-4 rounded-2xl bg-[#cde9bb] p-3">
            <label className="block w-fit pb-1" htmlFor="textToFind">
              Text to find
            </label>
            <input
              id="textToFind"
              placeholder="Green apple"
              type="text"
              className="m-0 rounded-lg bg-white px-2 py-1 outline outline-black focus:outline-2"
              value={textToFind}
              onChange={(e) => setTextToFind(e.target.value)}
            />
          </div>
          <div className="m-1 mb-4 rounded-2xl bg-[#cde9bb] p-3">
            <label className="block w-fit pb-1" htmlFor="textToReplaceWith">
              Replace with
            </label>
            <input
              id="textToReplaceWith"
              placeholder="Yellow apple"
              type="text"
              className="m-0 rounded-lg bg-white px-2 py-1 outline outline-black focus:outline-2"
              value={textToReplaceWith}
              onChange={(e) => setTextToReplaceWith(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
