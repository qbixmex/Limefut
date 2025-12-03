export interface Gallery {
  id?: string;
  title: string;
  permalink: string;
  galleryDate: Date;
  active: boolean;
  createdAt?: Date;
  updatedAt: Date;
}
