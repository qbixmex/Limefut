import { Suspense, type FC } from 'react';
import { ResultsSkeleton } from './results-skeleton';
import { ResultsList } from './results-list';

type Props = Readonly<{
  searchParamsPromise: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const ResultsContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    torneo: tournament,
    categoria: category,
    formato: format,
  } = await searchParamsPromise;

  if (!tournament && !category && !format) {
    return null;
  }

  return (
    <Suspense
      key={
        `${tournament ?? 'tournament'}`
        + `-${category ?? 'category'}`
        + `-${format ?? 'format'}`
      }
      fallback={<ResultsSkeleton />}
    >
      <ResultsList
        tournament={tournament}
        category={category}
        format={format}
      />
    </Suspense>
  );
};

export default ResultsContent;
