import { Suspense, type FC } from 'react';
import { PagesTableSkeleton } from './pages-table-skeleton';
import { PagesTable } from './pages-table';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const CustomPagesView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <Suspense
      key={`${query}-${currentPage}`}
      fallback={<PagesTableSkeleton />}
    >
      <PagesTable query={query} currentPage={currentPage} />
    </Suspense>
  );
};
