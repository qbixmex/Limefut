import { Suspense, type FC } from 'react';
import { Heading, TournamentsSelectorSkeleton } from '../components';
import { BracketView } from './(components)/bracket-view';
import { BracketSkeleton } from './(components)/bracket-skeleton';
import { SearchParamsSelectors } from '@/shared/components/search-params-selectors';

export const ResultsPage: FC = () => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Encuentros de Liguilla
      </Heading>
      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelectors />
      </Suspense>
      <Suspense fallback={<BracketSkeleton />}>
        <BracketView />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
