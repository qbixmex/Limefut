import { Suspense, type FC } from 'react';
import {
  Heading,
  TournamentsSelector,
  TournamentsSelectorSkeleton,
} from '../components';
import { ResultsContent } from './(components)/results-content';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then((sp) => ({ id: sp.torneo }));

  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Resultados
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <TournamentsSelector />
      </Suspense>

      <Suspense>
        <ResultsContent tournament={tournamentPromise} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
