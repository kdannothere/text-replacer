import type { CommandName } from "@/background"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import browser from "webextension-polyfill"

export const reloadApp = () => browser.runtime.reload()

export const getStorage = async () => await browser.storage.local.get(null)

export const setStorage = async (items: Record<string, string>) =>
  await browser.storage.local.set(items)

export const sendMessage = async (command: CommandName) =>
  await browser.runtime.sendMessage({ command: command })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
