import { PAGE_STATUS } from '@/shared/interfaces/Page';

export const customPageMock = {
  id: '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21',
  title: 'Página de prueba',
  permalink: 'pagina-de-prueba',
  status: PAGE_STATUS.PUBLISHED,
  content: '# Contenido de prueba',
  position: 1,
  seoTitle: 'Título SEO de prueba',
  seoDescription: 'Descripción SEO de prueba',
  seoRobots: 'index, follow',
  createdAt: new Date('2024-01-15T10:00:00.000Z'),
  updatedAt: new Date('2024-02-20T12:00:00.000Z'),
  images: [
    {
      id: 'image-1',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-1.jpg',
      resourceId: 'pages/image-1',
    },
    {
      id: 'image-2',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-2.jpg',
      resourceId: 'pages/image-2',
    },
  ],
};
