import { randomUUID } from 'node:crypto';
import type { FC } from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { fetchCategoryAction } from '../../(actions)/fetch-category.action';
import { EditCategoryForm } from '../../(components)/edit-category-form';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCategoryView: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const categoryId = (await params).id;

  if (session && !(session.user.roles as string[]).includes('admin')) {
    const message = '¡ No tienes permisos administrativos para editar categorías !';
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  const { ok, message, category } = await fetchCategoryAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    categoryId,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditCategoryForm
      key={randomUUID()}
      authenticatedUserId={session?.user.id}
      authenticatedUserRoles={session?.user.roles}
      category={category!}
    />
  );
};
