import { REGEX_EMAIL } from "../constants/login"

export const isValidEmail = (email: string): boolean => {
  return REGEX_EMAIL.test(email)
}