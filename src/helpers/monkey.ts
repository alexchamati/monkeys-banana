import { THANK_YOU_MESSAGES } from "../constants/monkey"

export function getThankYouMessage(name: string): string {
  const index = Math.floor(Math.random() * THANK_YOU_MESSAGES.length)
  return THANK_YOU_MESSAGES[index](name)
}