import { type FC, Suspense } from 'react';
import type { Metadata } from 'next';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { TeamsContent } from './(components)/TeamsContent';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

export const metadata: Metadata = {
  title: 'Equipos',
  description: 'Equipos participantes.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

const TeamsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(({ tournament }) => ({ tournament }));

  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-500">
        Equipos
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors tournamentPromise={tournamentPromise} />
      </Suspense>

      <Suspense>
        <ErrorHandler />
        <TeamsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default TeamsPage;
