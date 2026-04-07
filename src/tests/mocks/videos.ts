import { PLATFORM } from '@/shared/constants/platforms';

type VideoType = {
  id: string;
  title: string;
  permalink: string;
  publishedDate: Date;
  url: string;
  platform: string;
};

export const videos: VideoType[] = [
  {
    id: '2948',
    title: 'Tiro de penales',
    permalink: 'tiro-de-penales',
    publishedDate: new Date('2026-04-04T10:05:22.456Z'),
    url: 'https://youtube.com/c/limefut/129432',
    platform: PLATFORM.YOUTUBE,
  },
  {
    id: 'f936',
    title: 'Festejando el título',
    permalink: 'festejando-titulo',
    publishedDate: new Date('2026-12-18T14:22:15.233Z'),
    url: 'https://facebook.com/limefut/37942',
    platform: PLATFORM.FACEBOOK,
  },
];
