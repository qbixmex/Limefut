export const LANGUAGE = {
  NONE: 'none',
  SPANISH: 'es',
  ENGLISH: 'en',
} as const;

export type LANGUAGE_TYPE = typeof LANGUAGE[keyof typeof LANGUAGE];
