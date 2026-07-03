import { Suspense, type FC } from 'react';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { BracketContent } from './(components)/bracket-content';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';
import { ErrorHandler } from '@/shared/components/errorHandler';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(({ tournament }) => ({ tournament }));

  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Encuentros de Liguilla
      </Heading>
      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors tournamentPromise={tournamentPromise} />
      </Suspense>
      <Suspense>
        <ErrorHandler />
        <BracketContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
