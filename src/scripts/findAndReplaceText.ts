interface Result {
    data: string | null;
    error: string | null;
}

export async function findAndReplaceText(find: string, replace: string): Promise<Result> {
    console.log("Content script started: findAndReplaceText")
    const result: Result = { data: null, error: null };

    if (!find) {
        result.error = "Search string cannot be empty.";
        return result;
    }

    try {
        let matchCount = 0;

        // Helper to bypass React/Vue state managers and force input updates
        function updateInputValue(el: Element, newValue: string) {
            const tagName = el.tagName.toLowerCase();

            // Bypass React's hijacked setter
            if (tagName === "textarea") {
                const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    "value",
                )?.set;
                nativeTextAreaValueSetter?.call(el, newValue);
            } else if (tagName === "input") {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype,
                    "value",
                )?.set;
                nativeInputValueSetter?.call(el, newValue);
            } else {
                (el as any).value = newValue; // Fallback for custom web components
            }

            // Dispatch events to tell the framework the value changed
            el.dispatchEvent(new Event("input", { bubbles: true }));
            el.dispatchEvent(new Event("change", { bubbles: true }));
        }

        function traverseDOM(node: Node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const el = node as Element;
                const tagName = el.tagName.toLowerCase();

                if (tagName === "script" || tagName === "style" || tagName === "noscript") {
                    return;
                }

                // Handle inputs and textareas dynamically
                if (
                    (tagName === "input" || tagName === "textarea") &&
                    typeof (el as any).value === "string"
                ) {
                    const currentValue = (el as any).value as string;
                    if (currentValue.includes(find)) {
                        const newValue = currentValue.split(find).join(replace);
                        updateInputValue(el, newValue);
                        matchCount++;
                    }
                }

                if (el.shadowRoot) {
                    traverseDOM(el.shadowRoot);
                }
            }

            // Handle standard text nodes
            if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
                if (node.nodeValue.includes(find)) {
                    node.nodeValue = node.nodeValue.split(find).join(replace);
                    // Note: Changing standard text nodes is still vulnerable to being
                    // overwritten by React/Vue if the parent component re-renders.
                    matchCount++;
                }
            }

            const children = Array.from(node.childNodes);
            for (const child of children) {
                traverseDOM(child);
            }
        }

        traverseDOM(document.body);

        result.data = `Successfully replaced ${matchCount} occurrence(s) of "${find}".`;
    } catch (error: any) {
        result.error = error?.message || "An unexpected error occurred during replacement.";
    }

    return result;
}
