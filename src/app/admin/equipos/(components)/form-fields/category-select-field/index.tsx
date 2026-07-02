import type { FC } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';
import { fetchCategoriesAction } from '../../../(actions)';
import { CategoriesFormSelect } from './categories-form-select';

export const CategorySelectField: FC = async () => {
  const { ok, message, categories } = await fetchCategoriesAction();

  if (!ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <CategoriesFormSelect categories={categories} />
  );
};
