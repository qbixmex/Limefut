import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { Heading } from '../components';
import { Standings } from './(components)/standings';
import { TournamentsSelectorSkeleton } from './(components)/TournamentsSelectorSkeleton';
import { TournamentsSelector } from './(components)/TournamentsSelector';
import "./styles.css";

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

export const StandingsPage: FC<Props> = async ({ searchParams }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading className="text-emerald-600" level="h1">
        Estadísticas
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <TournamentsSelector />
      </Suspense>

      <Suspense>
        <Standings searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default StandingsPage;
