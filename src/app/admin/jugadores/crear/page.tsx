import { Suspense } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreatePlayerView } from './create-player-view';

type Props = Readonly<{
  searchParams: Promise<{
    tournament?: string;
  }>;
}>;

const CreatePlayerPage = async ({ searchParams }: Props) => {
  const { tournament } = await searchParams;

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
              Crear Jugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CreatePlayerView tournament={tournament} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePlayerPage;
