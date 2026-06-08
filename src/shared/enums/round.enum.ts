export const ROUND = {
  QUARTER_FINAL: 'quarterfinal',
  SEMI_FINAL: 'semifinal',
  FINAL: 'final',
} as const;

export type ROUND_TYPE = (typeof ROUND)[keyof typeof ROUND];
