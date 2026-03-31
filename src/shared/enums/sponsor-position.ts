export const SPONSOR_POSITION = {
  HOME_TOP: 'home_top',
  HOME_RIGHT: 'home_right',
  HOME_BOTTOM: 'home_bottom',
  HOME_LEFT: 'home_left',
} as const;

export type SPONSOR_POSITION = typeof SPONSOR_POSITION[keyof typeof SPONSOR_POSITION];
