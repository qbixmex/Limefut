import { Suspense, type FC } from 'react';
import { MatchesTable } from './matches-table';
import { ConcentratedMatchesSkeleton } from './concentrated-matches-skeleton';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    torneo?: string;
    categoria?: string;
  }>;
}>;

export const MatchesContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    torneo: tournament,
    categoria: category,
  } = await searchParamsPromise;

  if (!tournament || !category) {
    return null;
  }

  return (
    <>
      <Suspense
        key={`${tournament ?? 'tournament'}-${category ?? 'category'}`}
        fallback={<ConcentratedMatchesSkeleton />}
      >
        <MatchesTable
          tournament={tournament as string}
          category={category as string}
        />
      </Suspense>
    </>
  );
};

export default MatchesContent;
