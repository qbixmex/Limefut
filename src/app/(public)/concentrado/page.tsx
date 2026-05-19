import { Suspense, type FC } from 'react';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { MatchesContent } from './(components)/matches-content';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <div className="wrapper">
        <Heading level="h1" className="text-emerald-600">
          Concentrado de Encuentros
        </Heading>
        <Suspense fallback={<TournamentsSelectorSkeleton />}>
          <SearchParamsSelectors />
        </Suspense>
        <Suspense>
          <ErrorHandler />
          <MatchesContent searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </>
  );
};

export default ResultsPage;
