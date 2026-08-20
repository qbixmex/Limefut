import { Suspense, type FC } from 'react';
import { TeamViewSkeleton } from '../(components)/team-view-skeleton';
import { TeamPageView } from './team-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const TeamPage: FC<Props> = ({ params }) => {
  return (
    <Suspense fallback={<TeamViewSkeleton />}>
      <TeamPageView params={params} />
    </Suspense>
  );
};

export default TeamPage;
