import { Suspense, type FC } from 'react';
import {
  Heading,
  TournamentsSelector,
  TournamentsSelectorSkeleton,
} from '../components';

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

export const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Resultados
      </Heading>

      <Suspense fallback={<TournamentsSelectorSkeleton />}>
        <TournamentsSelector />
      </Suspense>

      {/* <Suspense> */}
        {/* COMPONENT */}
      {/* </Suspense> */}
    </div>
  );
};

export default ResultsPage;
