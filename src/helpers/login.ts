import { REGEX_EMAIL } from "../constants/login"

export function isValidEmail(email: string): boolean {
  return REGEX_EMAIL.test(email)
}