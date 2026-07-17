export const MATCH_GROUP = {
  GOLDER: 'golder',
  SILVERED: 'silvered',
} as const;

export type MATCH_GROUP_TYPE = (typeof MATCH_GROUP)[keyof typeof MATCH_GROUP];
