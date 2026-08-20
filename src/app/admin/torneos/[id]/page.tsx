import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TournamentView } from './tournament-view';
import { EditTournamentWrapper } from '../(components)/edit-tournament-wrapper';
import { EditTournamentSkeleton } from '../(components)/edit-tournament-skeleton';
import { TournamentViewSkeleton } from '../(components)/tournament-view-skeleton';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const TournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >
              Información del Torneo
            </CardTitle>
            <Suspense fallback={<EditTournamentSkeleton />}>
              <EditTournamentWrapper params={params} />
            </Suspense>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TournamentViewSkeleton />}>
              <TournamentView paramsPromise={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentPage;
