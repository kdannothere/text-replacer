import { useState, useEffect } from "react"
import browser from "webextension-polyfill"

export default function useBrowserStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const loadStoredValue = async () => {
      try {
        const result = await browser.storage.local.get(key)
        if (result[key] !== undefined) {
          setStoredValue(result[key] as T)
        }
      } catch (error) {
        console.error(`Error loading storage key "${key}":`, error)
      }
    }

    loadStoredValue()
  }, [key])

  const setValue = async (value: T | ((val: T) => T)) => {
    try {
      // Handle functional updates like setStoredValue(prev => !prev)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)
      await browser.storage.local.set({ [key]: valueToStore })
    } catch (error) {
      console.error(`Error setting storage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
