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
 * Slugify a string by converting it to a URL-friendly format.
 * @param name - The name to slugify
 * @example ```typescript
 * slugify("how to use the best image ever.png");
 * // Returns "how-to-use-the-best-image-ever"
 * ```
 * @returns The slugified name
 */
export const slugify = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/\.[^/.]+$/, "") // removes extension
    .trim() // removes trailing spaces
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric characters with dashes
    .replace(/^-+|-+$/g, ""); // remove leading and trailing dashes
};

/**
 * Simulates an asynchronous request.
 * @param time time in seconds.
 * ```ts
 * sleep(2); // 2 seconds promise simulation.
 * ```
 * @returns a promise to be resolved.
 */
export const sleep = (time: number = 1): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time * 1000));
};

/**
 *  Translates the tournament stage to a label and variant.
 * @param stage - The stage of the tournament.
 * ```ts
 * getStageTranslation("regular");
 * // Returns:
 * {
 *  label: "regular",
 *  variant: "outline-info",
 * }
 * getStageTranslation("playoffs");
 * // Returns:
 * {
 *   label: "liguilla",
 *   variant: "outline-warning",
 *  }
 * getStageTranslation("finals");
 * // Returns:
 * {
 *   label: "finales",
 *   variant: "outline-success",
 * }
 * // for unknown stages.
 * ```
 * {
 *   label: 'desconocido',
 *   variant: 'outline-secondary',
 * }
 * @returns An object containing the label and variant for the stage.
 */
export const getStageTranslation = (stage: string): {
    label: string;
    variant:
      | 'outline-info'
      | 'outline-warning'
      | 'outline-success'
      | 'outline-secondary';
  } => {
    switch(stage) {
      case 'regular':
        return {
          variant: 'outline-info',
          label: 'regular',
        };
      case 'playoffs':
        return {
          variant: 'outline-warning',
          label: 'liguilla',
        };
      case 'finals':
        return {
          variant: 'outline-success',
          label: 'finales',
        };
      default:
        return {
          label: 'desconocida',
          variant: 'outline-secondary',
        };
    }
  };
