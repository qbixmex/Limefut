import { randomUUID } from 'node:crypto';
import { Suspense, type FC } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { auth } from '@/lib/auth';
import type { Session } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import type { TournamentType } from '../../(actions)';
import { fetchTournamentAction, fetchCategoriesAction } from '../../(actions)';
import { TournamentForm } from '../../(components)/tournament-form';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

type EditTournamentContentProps = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
}>;

const EditTournamentPage: FC<Props> = ({ params }) => {
  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Editar Torneo</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense>
              <EditTournamentContent paramsPromise={params} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const EditTournamentContent: FC<EditTournamentContentProps> = async ({ paramsPromise }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const tournamentId = (await paramsPromise).id;
  const responseTournament = await fetchTournamentAction(tournamentId, session?.user.roles ?? null);

  if (!responseTournament.ok) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(responseTournament.message)}`);
  }

  const responseCategories = await fetchCategoriesAction();

  if (!responseCategories.ok) {
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(responseCategories.message)}`);
  }

  return (
    <TournamentForm
      key={randomUUID()}
      session={session as Session}
      tournament={responseTournament.tournament as TournamentType}
      categories={responseCategories.categories}
    />
  );
};

export default EditTournamentPage;
