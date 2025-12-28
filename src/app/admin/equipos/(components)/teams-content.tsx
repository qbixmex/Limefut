import { type FC, Suspense } from "react";
import { TeamsTableSkeleton } from "./teams-table-skeleton";
import { ErrorHandler } from "@/shared/components/errorHandler";
import { TeamsWrapper } from "../../encuentros/(components)/teams-wrapper";

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
    torneo?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const {
    torneo: tournamentId,
    query = '',
    page: currentPage = 1,
  } = await searchParams;

  if (!tournamentId) return null;

  return (
    <>
      <ErrorHandler />
      <Suspense
        key={`${query ?? 'query'}-${currentPage}`}
        fallback={<TeamsTableSkeleton colCount={9} rowCount={6} />}
      >
        <TeamsWrapper
          tournamentId={tournamentId}
          currentPage={+currentPage}
          query={query}
        />
      </Suspense>
    </>
  );
};

export default TeamsContent;
