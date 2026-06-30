import crypto from 'node:crypto';
import { Suspense, type FC } from 'react';
import { headers } from 'next/headers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TeamForm } from '../(components)/teamForm';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { fetchCategoriesAction, fetchTournamentsForTeam } from '../(actions)';
import type { Coach } from '@/shared/interfaces';
import { fetchCoachesForTeam } from '../(actions)/fetchCoachesForTeam';
import type { Session } from '@/lib/auth-client';
import { fetchFieldsForTeam } from '../(actions)/fetchFieldsForTeam';
import { ROUTES } from '@/shared/constants/routes';

const CreateTeamPage = () => {
  return (
    <Suspense>
      <CreateTeamPageContent />
    </Suspense>
  );
};

const CreateTeamPageContent: FC = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear equipos !';
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(message)}`);
  }

  const responseTournaments = await fetchTournamentsForTeam();

  if (!responseTournaments.ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(responseTournaments.message)}`);
  }

  if (responseTournaments.ok && responseTournaments.tournaments?.length === 0) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent('¡ No puedes crear un equipo sin torneos activos !')}`);
  }

  const responseCoaches = await fetchCoachesForTeam();

  if (!responseCoaches.ok) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(responseCoaches.message)}`);
  }

  if (responseCoaches.ok && responseCoaches.coaches?.length === 0) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent('¡ No puedes crear un equipo sin entrenadores activos !')}`);
  }

  const responseCategories = await fetchCategoriesAction();

  if (responseCategories.ok && responseCategories.categories.length === 0) {
    redirect(`${ROUTES.ADMIN_TEAMS}?error=${encodeURIComponent(responseCategories.message)}`);
  }

  const responseFields = await fetchFieldsForTeam();

  const tournaments = responseTournaments.tournaments;
  const coaches = responseCoaches.coaches;
  const categories = responseCategories.categories;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <CardTitle className="admin-page-card-title">Crear Equipo</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              key={crypto.randomUUID()}
              session={session as Session}
              tournaments={tournaments}
              coaches={coaches as Coach[]}
              fields={responseFields.fields}
              categories={categories}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTeamPage;
