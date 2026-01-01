import { Suspense, type FC } from 'react';
import { ResultsSkeleton } from './results-skeleton';
import { ResultsList } from './results-list';
import { ErrorHandler } from "@/shared/components/errorHandler";

type Props = Readonly<{
  tournament: Promise<{
    id: string | undefined;
  }>;
}>;

export const ResultsContent: FC<Props> = async ({ tournament }) => {
  const tournamentId = (await tournament).id;

  return (
    <Suspense
      key={`tournamentId-${tournamentId}`}
      fallback={<ResultsSkeleton />}
    >
      <ResultsList tournamentId={tournamentId} />
      <ErrorHandler />
    </Suspense>
  );
};

export default ResultsContent;
