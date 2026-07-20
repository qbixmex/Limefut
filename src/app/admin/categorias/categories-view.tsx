import { type FC, Suspense } from 'react';
import { CategoriesTable } from './(components)/categories-table';
import { CategoriesTableSkeleton } from './(components)/categories-table.skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const CategoriesView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query || '';
  const currentPage = (await searchParams).page || '1';

  return (
    <Suspense
      key={`${query ?? 'query'}-${currentPage}`}
      fallback={<CategoriesTableSkeleton />}
    >
      <CategoriesTable query={query} currentPage={currentPage} />
    </Suspense>
  );
};
