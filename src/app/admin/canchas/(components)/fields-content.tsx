import { type FC, Suspense } from 'react';
import { FieldsWrapper } from './fields-wrapper';
import { FieldsTableSkeleton } from './fiels-table-skeleton';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    query?: string;
    page?: string;
    torneo?: string;
  }>;
}>;

export const FieldsContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    query = '',
    page: currentPage = 1,
  } = await searchParamsPromise;

  return (
    <Suspense
      key={`${query ?? 'query'}-${currentPage}`}
      fallback={<FieldsTableSkeleton />}
    >
      <FieldsWrapper
        currentPage={+currentPage}
        query={query}
      />
    </Suspense>
  );
};
