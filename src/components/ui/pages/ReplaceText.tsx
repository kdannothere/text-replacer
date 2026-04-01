import { CustomButton } from "../inputs/CustomButton"
import useBrowserStorage from "../utils/useBrowserStorage"

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
      <CustomButton
        className="min-w-1/2 scale-95 cursor-pointer bg-[#46b51e] px-6 text-white hover:scale-100 hover:bg-[#ffc800]"
        onClick={handleStart}
      >
        Start
      </CustomButton>
      <CustomButton
        className="min-w-1/2 scale-95 cursor-pointer bg-[#c06ab7] px-6 text-white hover:scale-100 hover:bg-[#ffc800]"
        onClick={handleReset}
      >
        Reset
      </CustomButton>

      <div className="my-4 rounded-2xl bg-[#bde9a2ff] p-4">
        <div className="input-group">
          <div className="m-1 mb-4 rounded-2xl bg-[#cde9bb] p-3">
            <label className="block w-fit pb-1 text-black" htmlFor="textToFind">
              Text to find
            </label>
            <input
              id="textToFind"
              placeholder="Green apple"
              type="text"
              className="m-0 w-full rounded-lg bg-white px-2 py-1 outline outline-gray-400 focus:outline-2"
              value={textToFind}
              onChange={(e) => setTextToFind(e.target.value)}
            />
          </div>
          <div className="m-1 mb-4 rounded-2xl bg-[#cde9bb] p-3">
            <label
              className="block w-fit pb-1 text-black"
              htmlFor="textToReplaceWith"
            >
              Replace with
            </label>
            <input
              id="textToReplaceWith"
              placeholder="Yellow apple"
              type="text"
              className="m-0 w-full rounded-lg bg-white px-2 py-1 outline outline-gray-400 focus:outline-2"
              value={textToReplaceWith}
              onChange={(e) => setTextToReplaceWith(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
