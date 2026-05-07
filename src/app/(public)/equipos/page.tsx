import { type FC, Suspense } from 'react';
import type { Metadata } from 'next';
import { Heading, SearchParamsSelector, TournamentsSelectorSkeleton } from '../components';
import { TeamsContent } from './(components)/TeamsContent';
import { ErrorHandler } from '@/shared/components/errorHandler';

export const metadata: Metadata = {
  title: 'Equipos',
  description: 'Equipos participantes.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    torneo: string;
  }>;
}>;

const TeamsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-500">
        Equipos
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelector />
      </Suspense>

      <Suspense>
        <ErrorHandler />
        <TeamsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TeamsPage;
