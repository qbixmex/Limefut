import { type FC, Suspense } from 'react';
import { TournamentsView } from './tournaments-view';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

const TournamentPage: FC<Props> = ({ searchParams }) => {
  return (
    <Suspense>
      <TournamentsView searchParams={searchParams} />
    </Suspense>
  );
};

export default TournamentPage;
