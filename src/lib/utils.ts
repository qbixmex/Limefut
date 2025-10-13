import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Pads a number with leading zeros.
 * @param n - The number to pad
 * @param d - The desired length of the output string
 * @example ```typescript
 * pad(5);
 * // Returns "05"
 * ```
 * @returns The padded number as a string
 */
export const pad = (n: number, d = 2) => n.toString().padStart(d, '0');

/**
 * Slugifies a string by converting it to a URL-friendly format.
 * @param name - The name to slugify
 * @example ```typescript
 * slugify("how to use the best image ever.png");
 * // Returns "how-to-use-the-best-image-ever"
 * ```
 * @returns The slugified name
 */
export const slugify = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\.[^/.]+$/, "") // removes extension
    .trim() // removes trailing spaces
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // remove leading and trailing dashes
};