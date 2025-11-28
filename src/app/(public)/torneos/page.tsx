import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { TournamentsTable } from './(components)/tournaments-table';
import { Heading } from '../components';
import { TournamentsSkeleton } from './(components)/tournaments.skeleton';

export const metadata: Metadata = {
  title: 'Torneos',
  description: 'Torneos en marcha de la liga menores de fútbol',
  robots: 'noindex, nofollow',
};

export const ContactPage: FC = () => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Torneos
      </Heading>

      <Suspense fallback={<TournamentsSkeleton />}>
        <TournamentsTable />
      </Suspense>
    </div>
  );
};

export default ContactPage;
