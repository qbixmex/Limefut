import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROBOTS } from "../shared/interfaces";
import { PAGE_STATUS } from "../shared/interfaces/Page";

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


/**
 * Gets the variant for the SEO robots badge.
 * 
 * @param robots - The SEO robots value.
 * @example ```typescript
 * getVariant("index, follow");
 * // Returns "outline-success"
 * ```
 * @returns The variant for the SEO robots badge.
 */
export const getBadgeRobotsVariant = (robots: ROBOTS) => {
  switch (robots) {
    case ROBOTS.INDEX_FOLLOW:
      return 'outline-success';
    case ROBOTS.INDEX_NO_FOLLOW:
      return 'outline-info';
    case ROBOTS.NO_INDEX_FOLLOW:
      return 'outline-warning';
    case ROBOTS.NO_INDEX_NO_FOLLOW:
      return 'outline-secondary';
    default:
      return 'outline-danger';
  }
};

/**
 * Translates the SEO robots to a user friendly string.
 * 
 * @param robots - The SEO robots value.
 * @example ```typescript
 * getRobots("index, follow");
 * // Returns "Indexar, Seguir"
 * ```
 * @returns A string representing the SEO robots in a user friendly format.
 */
export const getRobots = (robots: ROBOTS) => {
  switch (robots) {
    case ROBOTS.INDEX_FOLLOW:
      return "Indexar y Seguir";
    case ROBOTS.INDEX_NO_FOLLOW:
      return "Indexar y No Seguir";
    case ROBOTS.NO_INDEX_FOLLOW:
      return "No Indexar y Seguir";
    case ROBOTS.NO_INDEX_NO_FOLLOW:
      return "No Indexar y No Seguir";
    default:
      return "No Indexar y No Seguir";
  }
};

/**
 * Translates the page status to a user friendly string.
 * 
 * @param status - The page status value.
 * @example ```typescript
 * getPageStatus(PageStatus.DRAFT);
 * // Returns "Borrador"
 * getPageStatus(PageStatus.PUBLISHED);
 * // Returns "Publicada"
 * ```
 * @returns A string representing the page status in a user friendly format.
 */
export const getPageStatus = (status: PAGE_STATUS): {
  label: string;
  variant:
    | 'outline-info'
    | 'outline-warning'
    | 'outline-success'
    | 'outline-secondary';
} => {
  switch (status) {
    case PAGE_STATUS.DRAFT:
      return {
        label: "Borrador",
        variant: 'outline-secondary',
      };
    case PAGE_STATUS.HOLD:
      return {
        label: "Retenido",
        variant: "outline-warning",
      };
    case PAGE_STATUS.UNPUBLISHED:
      return {
        label: "No Publicado",
        variant: "outline-info",
      };
    case PAGE_STATUS.PUBLISHED:
      return {
        label: "Publicado",
        variant: "outline-success",
      };
    default:
      return {
        label: "Desconocido",
        variant: "outline-secondary",
      };
  }
};

/**
 * Translates the alignment value to Spanish.
 * @param alignment - The alignment value ("left", "center", "right").
 * @example ```typescript
 * getAlignmentTranslation("left");
 * // Returns "a la izquierda"
 * getAlignmentTranslation("center");
 * // Returns "al centro"
 * getAlignmentTranslation("right");
 * // Returns "a la derecha"
 * ```
 * @returns The alignment in Spanish.
 */
export const getAlignmentTranslation = (alignment: string) => {
  switch(alignment) {
    case "left":
      return "a la izquierda";
    case "center":
      return "al centro";
    case "right":
      return "a la derecha";
    default:
      return "desconocida";
  }
};