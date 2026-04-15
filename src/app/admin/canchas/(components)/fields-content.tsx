import { type FC, Suspense } from 'react';
import { FieldsWrapper } from './fields-wrapper';
// TODO import { FieldsTableSkeleton } from './fields-table-skeleton';
// import { FieldsWrapper } from '../../encuentros/(components)/teams-wrapper';

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
    <>
      <Suspense
        key={`${query ?? 'query'}-${currentPage}`}
        // TODO fallback={<FieldsTableSkeleton />}
      >
        <FieldsWrapper
          currentPage={+currentPage}
          query={query}
        />
      </Suspense>
    </>
  );
};
