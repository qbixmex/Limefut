export const PAGE_STATUS = {
  DRAFT: 'draft',
  HOLD: 'hold',
  UNPUBLISHED: 'unpublished',
  PUBLISHED: 'published',
} as const;

export type PAGE_STATUS_TYPE = typeof PAGE_STATUS[keyof typeof PAGE_STATUS];
