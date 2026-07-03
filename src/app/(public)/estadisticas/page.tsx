import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { Standings } from './(components)/standings';
import { ErrorHandler } from '@/shared/components/errorHandler';
import {
  Heading,
  TournamentsSelectorSkeleton,
} from '../components';
import './styles.css';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

export const metadata: Metadata = {
  title: 'Tabla de posiciones',
  description: 'Tabla de posiciones por torneo.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    tournament: string;
    category: string;
  }>;
}>;

export const StandingsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(({ tournament }) => ({ tournament }));

  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Estadísticas
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors tournamentPromise={tournamentPromise} />
      </Suspense>

      <Suspense>
        <ErrorHandler />
        <Standings searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default StandingsPage;
