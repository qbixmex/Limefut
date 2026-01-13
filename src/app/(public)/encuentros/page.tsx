import { Suspense, type FC } from 'react';
import { ErrorHandler } from "@/shared/components/errorHandler";
import { Heading, TournamentsSelector, TournamentsSelectorSkeleton } from '../components';
import { MatchesContent } from './(components)/matches-content';

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
      <div className="wrapper dark:bg-gray-600/20!">
        <Heading level="h1" className="text-emerald-600">
          Concentrado de Encuentros
        </Heading>
        <Suspense fallback={<TournamentsSelectorSkeleton />}>
          <TournamentsSelector />
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
