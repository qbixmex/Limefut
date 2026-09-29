import { type FC, Suspense } from 'react';
import { BannersWrapper } from './banners-wrapper';
import { BannersTableSkeleton } from './banners-table-skeleton';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const BannersView: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    query = '',
    page: currentPage = '1',
  } = await searchParamsPromise;

  return (
    <Suspense
      key={`${query ?? 'query'}-${currentPage}`}
      fallback={<BannersTableSkeleton />}
    >
      <BannersWrapper
        currentPage={+currentPage}
        query={query}
      />
    </Suspense>
  );
};
