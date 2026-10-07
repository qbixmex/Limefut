import { Suspense, type FC } from 'react';
import { VideosTable } from './videos-table';
import { VideosTableSkeleton } from './videos-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const VideosView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  return (
    <Suspense
      key={`${query ?? 'query'}-${currentPage ?? 'current-page'}`}
      fallback={<VideosTableSkeleton />}
    >
      <VideosTable
        query={query}
        currentPage={currentPage}
      />
    </Suspense>
  );
};
