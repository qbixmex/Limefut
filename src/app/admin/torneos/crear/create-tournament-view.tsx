import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';
import { CreateTournamentForm } from './create-tournament-form';
import { CategorySelectField } from '../(components)/form-fields/categories-select-field';

export const CreateTournamentView = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear torneos !';
    redirect(`${ROUTES.ADMIN_TOURNAMENTS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CreateTournamentForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      categorySlot={<CategorySelectField />}
    />
  );
};
