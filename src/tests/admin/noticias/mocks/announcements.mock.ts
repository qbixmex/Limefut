import type { AnnouncementsType } from '@/app/admin/noticias/(actions)/fetchAnnouncementsAction';

export const announcementsMock: AnnouncementsType[] = [
  {
    id: '1f0e2d3c-4b5a-4968-8776-655443322110',
    title: 'Noticia de Apertura',
    permalink: 'noticia-de-apertura',
    publishedDate: new Date('2026-01-15T12:00:00.000Z'),
    active: true,
  },
  {
    id: '6b1f0c2d-9e3a-4b5c-8d7e-1f2a3b4c5d6e',
    title: 'Noticia de Clausura',
    permalink: 'noticia-de-clausura',
    publishedDate: new Date('2026-05-20T12:00:00.000Z'),
    active: false,
  },
];

export const announcementsPaginationMock = {
  currentPage: 1,
  totalPages: 1,
};
