import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { TournamentsContainer } from './(components)/tournaments-container';
import { Heading } from '../components';
import { TournamentsSkeleton } from './(components)/tournaments.skeleton';

export const metadata: Metadata = {
  title: 'Torneos',
  description: 'Torneos en marcha de la liga menores de fútbol',
  robots: 'index, follow',
};

export const TournamentsPage: FC = () => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Torneos
      </Heading>
      <Suspense fallback={<TournamentsSkeleton />}>
        <TournamentsContainer />
      </Suspense>
    </div>
  );
};

export default TournamentsPage;
