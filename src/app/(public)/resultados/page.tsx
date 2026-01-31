import { Suspense, type FC } from 'react';
import {
  Heading,
  TournamentsSelector,
  TournamentsSelectorSkeleton,
} from '../components';
import { ResultsContent } from './(components)/results-content';
import { ErrorHandler } from "@/shared/components/errorHandler";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <>
      <div className="wrapper">
        <Heading level="h1" className="text-emerald-600">
          Rol de Juegos y Resultados
        </Heading>
        <Suspense fallback={<TournamentsSelectorSkeleton />}>
          <TournamentsSelector />
        </Suspense>
        <Suspense>
          <ErrorHandler />
          <ResultsContent searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </>
  );
};

export default ResultsPage;
