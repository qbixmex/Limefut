import { Suspense, type FC } from 'react';
import { CategorySelect } from './category-select';
import { fetchCategoriesForSelectorAction } from '@/shared/actions/fetch-categories-for-selector.action';
import { SelectSkeleton } from '@/shared/components/select-skeleton';

type Props = Readonly<{ tournament?: string; }>;

export const CategoriesSelector: FC<Props> = async ({ tournament }) => {
  if (!tournament) return null;

  const { categories } = await fetchCategoriesForSelectorAction(tournament);

  return (
    <Suspense fallback={<SelectSkeleton />}>
      <CategorySelect categories={categories} />
    </Suspense>
  );
};
