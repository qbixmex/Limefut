import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import "./styles.css";
import { Heading } from '../components';
import { Standings } from './(components)/standings';

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Tabla de posiciones por torneo.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
  }>;
}>;

export const StandingsPage: FC<Props> =  ({ searchParams }) => {
  const paramsPromise = searchParams.then((sp) => ({ tournamentPermalink: sp.torneo }));
  
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading className="text-emerald-600" level="h1">
        Estadísticas
      </Heading>
      <Suspense fallback={<p>Espere ...</p>}>
        <Standings paramsPromise={paramsPromise} />
      </Suspense>
    </div>
  );
};

export default StandingsPage;
