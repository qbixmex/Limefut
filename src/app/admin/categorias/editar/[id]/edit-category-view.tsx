import type { FC } from 'react';
import { fetchCategoryAction } from '../../(actions)/fetch-category.action';
import { EditCategoryForm } from '../../(components)/edit-category-form';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

type Props = Readonly<{
  params: Promise<{
    id: string;
  }>;
}>;

export const EditCategoryView: FC<Props> = async ({ params }) => {
  const categoryId = (await params).id;

  const { ok, message, category } = await fetchCategoryAction(categoryId);

  if (!ok) {
    redirect(`${ROUTES.ADMIN_CATEGORIES}?error=${encodeURIComponent(message)}`);
  }

  return (
    <EditCategoryForm category={category!} />
  );
};
