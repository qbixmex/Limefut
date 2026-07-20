import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { ROUTES } from '@/shared/constants/routes';
import { CreateCategoryForm } from '../(components)/create-category-form';

export const CreateCategoryView = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para crear categorías !';
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CreateCategoryForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
    />
  );
};
