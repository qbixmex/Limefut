export type GalleryImageMock = {
  id: string;
  title: string;
  imageUrl: string;
  active: boolean;
  position: number;
};

export const galleryImagesMock: GalleryImageMock[] = [
  {
    id: '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d',
    title: 'Equipo campeón',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/team-champions.jpg',
    active: true,
    position: 1,
  },
  {
    id: '2b3c4d5e-6f7a-4b8c-9d0e-1f2a3b4c5d6e',
    title: 'Recibiendo el trofeo',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/trophy.jpg',
    active: true,
    position: 2,
  },
  {
    id: '3c4d5e6f-7a8b-4c9d-0e1f-2a3b4c5d6e7f',
    title: 'Jugadores celebrando',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/celebration.jpg',
    active: true,
    position: 3,
  },
  {
    id: '4d5e6f7a-8b9c-4d0e-1f2a-3b4c5d6e7f80',
    title: 'Cuerpo técnico',
    imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/gallery_images/coach-team.jpg',
    active: false,
    position: 4,
  },
];
