import { Suspense, type FC } from 'react';
import { AnnouncementsTable } from './announcements-table';
import { AnnouncementsTableSkeleton } from './announcements-table-skeleton';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const AnnouncementsView: FC<Props> = async ({ searchParams }) => {
  const { query, page } = await searchParams;

  return (
    <Suspense
      key={`${query ?? 'query'}-${page ?? 'current-page'}`}
      fallback={<AnnouncementsTableSkeleton />}
    >
      <AnnouncementsTable
        query={query}
        currentPage={page}
      />
    </Suspense>
  );
};
