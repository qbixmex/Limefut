import type { GALLERY_TYPE } from '@/app/admin/galerias/(actions)/fetchGalleryAction';

export const galleryMock: GALLERY_TYPE = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Galería de Apertura',
  permalink: 'galeria-de-apertura',
  galleryDate: new Date('2026-01-15T12:00:00.000Z'),
  active: true,
  createdAt: new Date('2026-01-10T12:00:00.000Z'),
  updatedAt: new Date('2026-01-20T12:00:00.000Z'),
  images: [
    {
      id: '2a1b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
      title: 'Imagen de apertura',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/one.jpg',
      active: true,
      position: 1,
    },
    {
      id: '3b2c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
      title: 'Imagen de cierre',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/two.jpg',
      active: false,
      position: 2,
    },
  ],
};

export const galleryWithoutImagesMock: GALLERY_TYPE = {
  ...galleryMock,
  images: [],
};

export const galleryInactiveMock: GALLERY_TYPE = {
  ...galleryMock,
  active: false,
};
