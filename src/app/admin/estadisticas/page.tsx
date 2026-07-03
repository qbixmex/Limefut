import { type FC, Suspense } from 'react';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorHandler } from '@/shared/components/errorHandler';
import { TournamentsSelectorSkeleton } from './(components)/tournaments-selector-skeleton';
import { TournamentsWrapper } from './(components)/tournaments-wrapper';
import { StandingsView } from './(components)/standings-view';

export const metadata: Metadata = {
  title: 'Tabla de posiciones',
  description: 'Tabla de posiciones por torneo.',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const StandingsPage: FC<Props> = ({ searchParams }) => {
  const tournamentPromise = searchParams.then(sp => ({ tournament: sp.tournament }));

  return (
    <>
      <ErrorHandler />
      <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<TournamentsSelectorSkeleton />}>
                <TournamentsWrapper tournamentPromise={tournamentPromise} />
              </Suspense>
              <Suspense>
                <StandingsView searchParams={searchParams} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default StandingsPage;
