export enum ROBOTS {
  INDEX_FOLLOW = "index, follow",
  INDEX_NO_FOLLOW = "index, nofollow",
  NO_INDEX_FOLLOW = "noindex, follow",
  NO_INDEX_NO_FOLLOW = "noindex, nofollow",
}

export enum PAGE_STATUS {
  DRAFT = 'draft',
  HOLD = 'hold',
  UNPUBLISHED = 'unpublished',
  PUBLISHED = 'published',
}

export interface Page {
  id: string;
  title: string | null;
  permalink: string | null;
  content: string | null;
  position: number | null;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoRobots: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomPageImage {
  id?: string;
  imageUrl: string;
  publicId: string;
  createdAt?: Date;
  updatedAt?: Date;
}