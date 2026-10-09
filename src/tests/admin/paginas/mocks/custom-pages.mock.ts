import { PAGE_STATUS } from '@/shared/interfaces/Page';

export const customPagesMock = [
  {
    id: '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21',
    title: 'Página de prueba',
    permalink: 'pagina-de-prueba',
    position: 1,
    status: PAGE_STATUS.PUBLISHED,
    seoRobots: 'index, follow',
  },
  {
    id: '8b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e',
    title: 'Página secundaria',
    permalink: 'pagina-secundaria',
    position: 2,
    status: PAGE_STATUS.DRAFT,
    seoRobots: 'noindex, nofollow',
  },
  {
    id: 'c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
    title: null,
    permalink: null,
    position: 3,
    status: PAGE_STATUS.HOLD,
    seoRobots: null,
  },
];
