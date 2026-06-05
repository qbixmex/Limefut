export const PLAYOFF_ROUND = {
  QUARTERFINAL: 'quarterfinal',
  SEMIFINAL: 'semifinal',
  FINAL: 'final',
} as const;

export type PLAYOFF_ROUND_TYPE = typeof PLAYOFF_ROUND[keyof typeof PLAYOFF_ROUND];
