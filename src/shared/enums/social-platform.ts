export const SOCIAL_PLATFORM = {
  FACEBOOK: 'facebook',
  TWITTER_X: 'twitterX',
  INSTAGRAM: 'instagram',
  TIKTOK: 'tikTok',
  YOUTUBE: 'youtube',
} as const;

export type SOCIAL_PLATFORM = typeof SOCIAL_PLATFORM[keyof typeof SOCIAL_PLATFORM];
