import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import type { FC } from 'react';
import { fetchCategoriesAction } from '../../../(actions)/fetch-categories.action';
import { CategoriesFormSelect } from '@/app/(public)/resultados/guardar/category-select/categories-form-select';

export const CategorySelectField: FC = async () => {
  const { ok, message, categories } = await fetchCategoriesAction();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CategoriesFormSelect categories={categories} />
  );
};
