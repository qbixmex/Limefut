export const ALIGNMENT = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
} as const;

export type ALIGNMENT_TYPE = typeof ALIGNMENT[keyof typeof ALIGNMENT];
