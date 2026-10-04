export const galleriesMock = [
  {
    id: '1f0e2d3c-4b5a-4968-8776-655443322110',
    title: 'Galería de Apertura',
    permalink: 'galeria-de-apertura',
    galleryDate: new Date('2026-01-15T12:00:00.000Z'),
    active: true,
    imagesCount: 4,
  },
  {
    id: '6b1f0c2d-9e3a-4b5c-8d7e-1f2a3b4c5d6e',
    title: 'Galería de Clausura',
    permalink: 'galeria-de-clausura',
    galleryDate: new Date('2026-05-20T12:00:00.000Z'),
    active: false,
    imagesCount: 0,
  },
];

export const galleriesPaginationMock = {
  currentPage: 1,
  totalPages: 1,
};

// Shape returned by Prisma for the list action, before mapping `_count.images`.
export const prismaGalleriesMock = galleriesMock.map((gallery) => ({
  id: gallery.id,
  title: gallery.title,
  permalink: gallery.permalink,
  galleryDate: gallery.galleryDate,
  active: gallery.active,
  _count: { images: gallery.imagesCount },
}));
