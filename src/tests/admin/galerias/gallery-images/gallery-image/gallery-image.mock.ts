export type GalleryImageMock = {
  id: string;
  title: string;
  imageUrl: string;
  active: boolean;
  position: number;
};

export const galleryImageMock: GalleryImageMock = {
  id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
  title: 'Equipo campeón',
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/team-champions.jpg',
  active: true,
  position: 1,
};

export const galleryImageInactiveMock: GalleryImageMock = {
  ...galleryImageMock,
  id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
  title: 'Cuerpo técnico',
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/coach-team.jpg',
  active: false,
  position: 4,
};
