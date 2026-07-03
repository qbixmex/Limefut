import { Suspense, type FC } from 'react';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { ResultsContent } from './(components)/results-content';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    roles?: 'complete' | 'team' | 'field';
    team?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(({ tournament }) => ({ tournament }));

  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Rol de Juegos y Resultados
      </Heading>
      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors tournamentPromise={tournamentPromise} />
      </Suspense>
      <Suspense>
        <ErrorHandler />
        <ResultsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
