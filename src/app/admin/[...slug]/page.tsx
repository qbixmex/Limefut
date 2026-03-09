import { Suspense, type FC } from 'react';
import { notFound } from 'next/navigation';

type Props = Readonly<{
  params: Promise<{
    slug?: string[];
  }>;
}>;

const VALID_PARAMS = [
  'dashboard', 'torneos', 'equipos', 'entrenadores',
  'jugadores', 'encuentros', 'estadisticas', 'paginas',
  'banners', 'galerias', 'usuarios', 'mensajes',
];

const CatchAllPage: FC<Props> = ({ params }) => { 
  return (
    <Suspense>
      <CatchContent params={params} />
    </Suspense>
  );
};

const CatchContent: FC<Props> = async ({ params }) => {
  const slug = (await params).slug;

  if (!VALID_PARAMS.includes(slug?.[0] ?? '')) {
    notFound();
  }
};

export default CatchAllPage;
