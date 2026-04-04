export interface Announcement {
  id?: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  description: string;
  content: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
