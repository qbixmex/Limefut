import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { TournamentsList } from './(components)/tournaments-list';
import { Heading } from '../components';
import { TournamentsSkeleton } from './(components)/tournaments.skeleton';

export const metadata: Metadata = {
  title: 'Torneos',
  description: 'Torneos en marcha de la liga menores de fútbol',
  robots: 'noindex, nofollow',
};

export const TournamentsPage: FC = () => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Torneos
      </Heading>

      <Suspense fallback={<TournamentsSkeleton />}>
        <TournamentsList />
      </Suspense>
    </div>
  );
};

export default TournamentsPage;
