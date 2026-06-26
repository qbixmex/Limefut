export const data: VIDEO[] = [
  {
    id: '0c081a3d-52f3-42ef-bb46-0c911fe2c25e',
    title: 'Altamira Campeón',
    permalink: 'altamira-campeon',
    description: 'Celebración de Colegio Altamira exercitation occaecat adipisicing in ea anim eiusmod laborum excepteur pariatur. Velit fugiat ipsum nostrud esse sint ea adipisicing. Nisi proident eu ad labore et incididunt est. Nulla fugiat aliqua velit sit commodo labore id elit culpa.',
    url: 'https://youtube.com/c/limefut/altamira-campeon',
    platform: 'youtube',
    active: true,
    publishedDate: new Date('2026-06-24T14:12:15.467Z'),
    createdAt: new Date('2026-06-24T12:05:35.432Z'),
    updatedAt: new Date('2026-06-24T14:35:12.748Z'),
  },
  {
    id: '3d911361-5219-433e-ac9d-da10a876b848',
    title: 'Club Country vs Colegio Alemán',
    permalink: 'club-country-vs-colegio-aleman',
    description: 'Pariatur do reprehenderit consectetur aliqua sunt voluptate id dolore qui occaecat qui ipsum esse. Cillum irure do exercitation officia culpa Lorem id sunt id mollit proident. Exercitation consequat ex veniam sunt nisi ea pariatur sunt sint ea aliquip do cupidatat. Amet ad consequat ea velit ipsum exercitation do occaecat pariatur ipsum est sint.',
    url: 'https://youtube.com/c/limefut/country-vs-colegio-aleman',
    platform: 'facebook',
    active: true,
    publishedDate: new Date('2026-05-24T14:12:15.467Z'),
    createdAt: new Date('2026-05-24T12:05:35.432Z'),
    updatedAt: new Date('2026-05-24T14:35:12.748Z'),
  },
  {
    id: '5b4031cb-8378-4e5b-9f49-3a307dfe949f',
    title: 'Hormigas vs Lobos Jalisco',
    permalink: 'hormigas-vs-lobos',
    description: 'Pariatur do reprehenderit consectetur aliqua sunt voluptate id dolore qui occaecat qui ipsum esse. Cillum irure do exercitation officia culpa Lorem id sunt id mollit proident. Exercitation consequat ex veniam sunt nisi ea pariatur sunt sint ea aliquip do cupidatat. Amet ad consequat ea velit ipsum exercitation do occaecat pariatur ipsum est sint.',
    url: 'https://youtube.com/c/limefut/hormigas-vs-lobos',
    platform: 'tiktok',
    active: true,
    publishedDate: new Date('2026-05-24T14:12:15.467Z'),
    createdAt: new Date('2026-03-24T12:05:35.432Z'),
    updatedAt: new Date('2026-03-24T14:35:12.748Z'),
  },
  {
    id: 'f4888ad0-293c-4fc3-961e-197e4a5e1401',
    title: 'La Cima vs Diablos Alco',
    permalink: 'la-cima-vs-diablos-alco',
    description: 'Pariatur do reprehenderit consectetur aliqua sunt voluptate id dolore qui occaecat qui ipsum esse. Cillum irure do exercitation officia culpa Lorem id sunt id mollit proident. Exercitation consequat ex veniam sunt nisi ea pariatur sunt sint ea aliquip do cupidatat. Amet ad consequat ea velit ipsum exercitation do occaecat pariatur ipsum est sint.',
    url: 'https://youtube.com/c/limefut/la-cima-vs-diablos-alco',
    platform: 'instagram',
    active: true,
    publishedDate: new Date('2026-04-24T14:12:15.467Z'),
    createdAt: new Date('2026-03-24T12:05:35.432Z'),
    updatedAt: new Date('2026-03-24T14:35:12.748Z'),
  },
];

type VIDEO = {
  id: string;
  title: string;
  permalink: string;
  description: string;
  url: string;
  platform: string;
  active: boolean;
  publishedDate: Date;
  createdAt: Date;
  updatedAt: Date;
};
