export interface Video {
  id?: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  description: string;
  url: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
