import { Suspense, type FC } from 'react';
import { Heading, SearchParamsSelector, TournamentsSelectorSkeleton } from '../components';
import { ResultsContent } from './(components)/results-content';
import { ErrorHandler } from '@/shared/components/errorHandler';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    roles?: 'complete' | 'team' | 'field';
    team?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper">
      <Heading level="h1" className="text-emerald-600">
        Rol de Juegos y Resultados
      </Heading>
      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <SearchParamsSelector roles />
      </Suspense>
      <Suspense>
        <ErrorHandler />
        <ResultsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
