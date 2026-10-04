import type { FC } from 'react';
import { Suspense } from 'react';
import { GalleriesTableSkeleton } from './galleries-table-skeleton';
import { GalleriesTable } from './galleries-table';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const GalleriesView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <Suspense
      key={`${query ?? 'query'}-${currentPage}`}
      fallback={<GalleriesTableSkeleton />}
    >
      <GalleriesTable
        query={query}
        currentPage={currentPage}
      />
    </Suspense>
  );
};
