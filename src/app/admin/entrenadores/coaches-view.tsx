import { Suspense, type FC } from 'react';
import { CoachesTable } from './(components)/coaches-table';
import { CoachesTableSkeleton } from './(components)/coaches-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const CoachesPageView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query ?? '';
  const currentPage = (await searchParams).page ?? '1';

  return (
    <>
      <Suspense
        key={`${query ?? 'query'}-${currentPage}`}
        fallback={<CoachesTableSkeleton colCount={7} rowCount={6} />}
      >
        <CoachesTable
          query={query}
          currentPage={Number(currentPage)}
        />
      </Suspense>
    </>
  );
};
