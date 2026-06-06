import { CategoryFormSelect } from '@/app/(public)/resultados/guardar/category-select/category-form-select';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import { fetchCategoriesAction } from '../../../(actions)/fetch-categories.action';

type Props = Readonly<{
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}>;

export const CategorySelectField: FC<Props> = async ({
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const { ok, message, categories } = await fetchCategoriesAction({
    authenticatedUserId,
    authenticatedUserRoles,
  });

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CategoryFormSelect categories={categories} />
  );
};
