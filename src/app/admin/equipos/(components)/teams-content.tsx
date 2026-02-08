import { type FC, Suspense } from "react";
import { TeamsTableSkeleton } from "./teams-table-skeleton";
import { TeamsWrapper } from "../../encuentros/(components)/teams-wrapper";

type Props = Readonly<{
  searchParamsPromise: Promise<{
    query?: string;
    page?: string;
    torneo?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParamsPromise }) => {
  const {
    torneo: tournamentId,
    query = '',
    page: currentPage = 1,
  } = await searchParamsPromise;

  if (!tournamentId) return null;

  return (
    <>
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
