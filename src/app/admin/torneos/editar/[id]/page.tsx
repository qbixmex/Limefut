import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditTournamentView } from './edit-tournament-view';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

const EditTournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle
              className="admin-page-card-title"
              role="heading"
              aria-label="Título de la página"
            >Editar Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditTournamentView paramsPromise={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditTournamentPage;
