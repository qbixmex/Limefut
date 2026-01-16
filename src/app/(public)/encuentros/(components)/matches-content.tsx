import { Suspense, type FC } from 'react';
import { MatchesTable } from './matches-table';
import { ConcentratedMatchesSkeleton } from './concentrated-matches-skeleton';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const MatchesContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    torneo: tournament,
    categoria: category,
    formato: format,
  } = await searchParamsPromise;

  if (!tournament && !category && !format) {
    return null;
  }

  return (
    <>
      <Suspense
        key={`${tournament}-${category}-${format}`}
        fallback={<ConcentratedMatchesSkeleton />}
      >
        <MatchesTable
          tournament={tournament}
          category={category}
          format={format}
        />
      </Suspense>
    </>
  );

};

export default MatchesContent;
