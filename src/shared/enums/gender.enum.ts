export const GENDER = {
  FEMALE: 'female',
  MALE: 'male',
} as const;

export type GENDER_TYPE = (typeof GENDER)[keyof typeof GENDER];