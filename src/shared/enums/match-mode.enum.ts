export const MATCH_MODE = {
  LEAGUE: 'league',
  FRIENDLY: 'friendly',
} as const;

export type MATCH_MODE_TYPE = typeof MATCH_MODE[keyof typeof MATCH_MODE];
