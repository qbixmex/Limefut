import { create } from 'zustand';
import { devtools } from "zustand/middleware";

type GalleryImage = {
  id: string;
  title: string;
  active: boolean;
};

export interface GalleryStore {
  galleryImage: GalleryImage | null;
  setGalleryImage: (galleryImage: GalleryImage) => void;
  clearGalleryImage: () => void;
}

export const useImageGallery = create<GalleryStore>()(
  devtools((set) => ({
    galleryImage: null,
    setGalleryImage: (galleryImage) => set(() => ({ galleryImage })),
    clearGalleryImage: () => set(() => ({ galleryImage: null })),
  })),
);
