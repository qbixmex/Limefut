export const SPONSOR_ALIGNMENT = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
} as const;

export type SPONSOR_ALIGNMENT = typeof SPONSOR_ALIGNMENT[keyof typeof SPONSOR_ALIGNMENT];
