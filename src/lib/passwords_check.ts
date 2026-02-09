import { commonPasswords } from "../shared/data/passwords";

/**
 * Checks if the provided password is in the list of common passwords.
 * 
 * @param password The password to check against the list of common passwords.
 * @example
 * ```typescript
 * isPasswordInsecure("0123456789"); // returns true
 * ```
 * @returns A boolean indicating whether the password is considered common (true) or not (false).
 */
export const isPasswordInsecure = (password: string): boolean => {
  return commonPasswords.includes(password.trim());
};