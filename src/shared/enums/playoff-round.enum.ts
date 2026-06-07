export const PLAYOFF_ROUND = {
  QUARTER_FINAL: 'quarterfinal',
  SEMI_FINAL: 'semifinal',
  FINAL: 'final',
} as const;

export type PLAYOFF_ROUND_TYPE = typeof PLAYOFF_ROUND[keyof typeof PLAYOFF_ROUND];
