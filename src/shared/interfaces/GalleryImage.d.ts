export interface GalleryImage {
  id?: string;
  title: string;
  imageUrl: string;
  imagePublicID: string;
  active: boolean;
  galleryId: string;
  createdAt?: Date,
  updatedAt?: Date,
}
