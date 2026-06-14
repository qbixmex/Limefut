import { Suspense, type FC } from 'react';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { BracketSkeleton } from './(components)/bracket-skeleton';
import { BracketContent } from './(components)/bracket-content';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';
import { ErrorHandler } from '@/shared/components/errorHandler';

type Props = Readonly<{
  searchParams: Promise<{ tournament?: string; category?: string }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Encuentros de Liguilla
      </Heading>
      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors />
      </Suspense>
      <Suspense fallback={<BracketSkeleton />}>
        <ErrorHandler />
        <BracketContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
