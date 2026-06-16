import { Suspense, type FC } from 'react';
import { Heading } from '../../components';
import { MatchView } from './match-view';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
    local_team: string;
    visitor_team: string;
  }>;
}>;

const ResultsPage: FC<Props> = ({ searchParams }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Heading level="h1" className="text-emerald-600">
        Encuentro de liguilla
      </Heading>
      <Suspense>
        <MatchView searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default ResultsPage;
