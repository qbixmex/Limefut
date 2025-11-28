import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { Tournament } from './(components)/tournament';
import { TournamentSkeleton } from './(components)/tournament-skeleton';

export const metadata: Metadata = {
  title: 'Torneo',
  description: 'Detalles del Torneo',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const TournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Suspense fallback={<TournamentSkeleton />}>
        <Tournament params={params} />
      </Suspense>
    </div>
  );
};

export default TournamentPage;
