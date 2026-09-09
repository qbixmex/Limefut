export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const;

export type USER_ROLES_TYPE = (typeof USER_ROLES)[keyof typeof USER_ROLES];
