import { Suspense, type FC } from 'react';
import { Heading } from '../components';
import { BracketView } from './(components)/bracket-view';
import { BracketSkeleton } from './(components)/bracket-skeleton';

export const ResultsPage: FC = () => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Encuentros de Liguilla
      </Heading>
      <Suspense fallback={<BracketSkeleton />}>
        <BracketView />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
