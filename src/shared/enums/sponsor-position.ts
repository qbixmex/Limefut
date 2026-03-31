export const SPONSOR_POSITION = {
  HOME_TOP_SIDEBAR: 'home_top',
  HOME_RIGHT_SIDEBAR: 'home_right',
  HOME_BOTTOM_SIDEBAR: 'home_bottom',
  HOME_LEFT_SIDEBAR: 'home_left',
} as const;

export type SPONSOR_POSITION = typeof SPONSOR_POSITION[keyof typeof SPONSOR_POSITION];
