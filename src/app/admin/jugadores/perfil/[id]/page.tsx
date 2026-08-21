import { Suspense, type FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerView } from './player-view';
import { PlayerViewSkeleton } from './player-view-skeleton';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const PlayerPage: FC<Props> = ({ params }) => {
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
              Información del Jugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<PlayerViewSkeleton />}>
              <PlayerView params={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerPage;
