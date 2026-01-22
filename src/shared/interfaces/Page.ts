export enum ROBOTS {
  INDEX_FOLLOW = "index, follow",
  INDEX_NO_FOLLOW = "index, nofollow",
  NO_INDEX_FOLLOW = "noindex, follow",
  NO_INDEX_NO_FOLLOW = "noindex, nofollow",
}

export interface Page {
  id?: string;
  title: string;
  permalink: string;
  content: string;
  active: boolean;

  seoTitle: string | null;
  seoDescription: string | null;
  seoRobots: ROBOTS | null;
  
  createdAt?: Date;
  updatedAt?: Date;
}
