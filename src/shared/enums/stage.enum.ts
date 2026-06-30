export const STAGE = {
  REGULAR: 'regular',
  PLAYOFFS: 'playoffs',
  FINALS: 'finals',
} as const;

export type STAGE_TYPE = typeof STAGE[keyof typeof STAGE];
