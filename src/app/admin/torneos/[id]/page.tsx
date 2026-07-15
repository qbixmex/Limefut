import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditTournament } from '../(components)/edit-tournament';
import { TournamentView } from './tournament-view';

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
            <EditTournament paramsPromise={params} side="left" />
          </CardHeader>
          <CardContent>
            <TournamentView paramsPromise={params} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TournamentPage;
