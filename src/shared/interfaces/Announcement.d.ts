export interface Announcement {
  id?: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  imageUrl: string | null;
  imagePublicID: string | null;
  description: string;
  content: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
