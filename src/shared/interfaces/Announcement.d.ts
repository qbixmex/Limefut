export interface Announcement {
  id?: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  description: string;
  content: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
