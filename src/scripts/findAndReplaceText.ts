import type { ReplacementPair } from "@/components/ui/elements/ReplacementPairItem"

export interface Result {
  data: string | null
  error: string | null
}

export async function findAndReplaceTextPairs(
  pairs: ReplacementPair[]
): Promise<Result[]> {
  console.log("Content script started: findAndReplaceTextPairs")

  async function findAndReplaceText(
    find: string,
    replace: string
  ): Promise<Result> {
    const result: Result = { data: null, error: null }

    if (!find) {
      result.error = "Search string cannot be empty."
      return result
    }

    try {
      let matchCount = 0

      // Helper to bypass React/Vue state managers and force input updates
      function updateInputValue(el: Element, newValue: string) {
        const tagName = el.tagName.toLowerCase()

        if (tagName === "textarea") {
          const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype,
            "value"
          )?.set
          nativeTextAreaValueSetter?.call(el, newValue)
        } else if (tagName === "input") {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set
          nativeInputValueSetter?.call(el, newValue)
        } else {
          ;(el as any).value = newValue
        }

        // Dispatch events with standard properties
        const eventOptions = { bubbles: true, composed: true, cancelable: true }
        el.dispatchEvent(new Event("focus", eventOptions))
        el.dispatchEvent(new Event("keydown", eventOptions))
        el.dispatchEvent(new Event("keyup", eventOptions))
        el.dispatchEvent(new Event("input", eventOptions))
        el.dispatchEvent(new Event("change", eventOptions))
        el.dispatchEvent(new Event("blur", eventOptions))
      }

      function traverseDOM(node: Node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element
          const tagName = el.tagName.toLowerCase()

          if (
            tagName === "script" ||
            tagName === "style" ||
            tagName === "noscript"
          ) {
            return
          }

          // === UPGRADE: Detect CodeMirror Instances ===
          if (el.classList && el.classList.contains("CodeMirror")) {
            const cm = (el as any).CodeMirror
            if (cm && typeof cm.getValue === "function") {
              const currentValue = cm.getValue()
              if (currentValue.includes(find)) {
                cm.setValue(currentValue.split(find).join(replace))
                matchCount++
              }
              return // Skip traversing children so we don't break CodeMirror's DOM
            }
          }

          // Handle standard inputs and textareas
          if (
            (tagName === "input" || tagName === "textarea") &&
            typeof (el as any).value === "string"
          ) {
            const currentValue = (el as any).value as string
            if (currentValue.includes(find)) {
              const newValue = currentValue.split(find).join(replace)
              updateInputValue(el, newValue)
              matchCount++
            }
          }

          if (el.shadowRoot) {
            traverseDOM(el.shadowRoot)
          }
        }

        // Handle standard text nodes
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
          if (node.nodeValue.includes(find)) {
            node.nodeValue = node.nodeValue.split(find).join(replace)
            matchCount++

            // === UPGRADE: Dispatch events for contenteditable divs (e.g., Notion, Twitter) ===
            const parentElement = node.parentElement
            if (parentElement) {
              const editableParent = parentElement.closest(
                '[contenteditable="true"]'
              )
              if (editableParent) {
                editableParent.dispatchEvent(
                  new Event("input", { bubbles: true, composed: true })
                )
              }
            }
          }
        }

        const children = Array.from(node.childNodes)
        for (const child of children) {
          traverseDOM(child)
        }
      }

      traverseDOM(document.body)

      result.data = `Successfully replaced ${matchCount} occurrence(s) of "${find}".`
    } catch (error: any) {
      result.error =
        error?.message || "An unexpected error occurred during replacement."
    }

    return result
  }

  const results: Result[] = []
  for (const pair of pairs) {
    results.push(await findAndReplaceText(pair.find, pair.replace))
  }
  console.log("Content script finished: findAndReplaceTextPairs")
  return results
}
