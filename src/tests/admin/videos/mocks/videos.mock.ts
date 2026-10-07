import type { VideosType } from '@/app/admin/videos/(actions)/fetchVideosAction';

export const videosMock: VideosType[] = [
  {
    id: '1f0e2d3c-4b5a-4968-8776-655443322110',
    title: 'Video de Apertura',
    permalink: 'video-de-apertura',
    publishedDate: new Date('2026-01-15T12:00:00.000Z'),
    platform: 'youtube',
    active: true,
  },
  {
    id: '6b1f0c2d-9e3a-4b5c-8d7e-1f2a3b4c5d6e',
    title: 'Video de Clausura',
    permalink: 'video-de-clausura',
    publishedDate: new Date('2026-05-20T12:00:00.000Z'),
    platform: 'facebook',
    active: false,
  },
];

export const videosPaginationMock = {
  currentPage: 1,
  totalPages: 1,
};
