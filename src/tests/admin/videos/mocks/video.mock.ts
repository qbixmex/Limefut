import type { VIDEO_TYPE } from '@/app/admin/videos/(actions)/fetchVideoAction';

export const videoMock: VIDEO_TYPE = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Video de Apertura',
  permalink: 'video-de-apertura',
  description: 'Descripción del video de apertura',
  url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  platform: 'youtube',
  publishedDate: new Date('2026-01-15T12:00:00.000Z'),
  active: true,
  createdAt: new Date('2026-01-10T12:00:00.000Z'),
  updatedAt: new Date('2026-01-20T12:00:00.000Z'),
};

export const videoInactiveMock: VIDEO_TYPE = {
  ...videoMock,
  active: false,
};
