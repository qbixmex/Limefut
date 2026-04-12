export interface SeoSection {
  id: string;
  permalink: string;
  title: string;
  description: string;
  robots?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
