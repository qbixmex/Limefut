import type { ANNOUNCEMENT_TYPE } from '@/app/admin/noticias/(actions)/fetchAnnouncementAction';

export const announcementMock: ANNOUNCEMENT_TYPE = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Noticia de Apertura',
  permalink: 'noticia-de-apertura',
  description: 'Descripción de la noticia de apertura',
  content: '# Contenido\n\nTexto de la noticia de apertura',
  publishedDate: new Date('2026-01-15T12:00:00.000Z'),
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/one.jpg',
  active: true,
  createdAt: new Date('2026-01-10T12:00:00.000Z'),
  updatedAt: new Date('2026-01-20T12:00:00.000Z'),
};

export const announcementInactiveMock: ANNOUNCEMENT_TYPE = {
  ...announcementMock,
  active: false,
};

export const announcementWithoutImageMock: ANNOUNCEMENT_TYPE = {
  ...announcementMock,
  imageUrl: null,
};
