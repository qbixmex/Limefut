import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import './styles.css';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Ultimas noticias de Limefut',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const AnnouncementPage: FC<Props> = ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Suspense>
        <h1>Noticia</h1>
        <AnnouncementContent params={params} />
      </Suspense>
    </div>
  );
};

export const AnnouncementContent: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  return (
    <>
      <p>Enlace permanente: { permalink }</p>
      <p>La noticia completa se mostrará aquí dentro pronto</p>
    </>
  );
};

export default AnnouncementPage;
