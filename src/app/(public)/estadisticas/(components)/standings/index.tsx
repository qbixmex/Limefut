import { Suspense, type FC } from "react";
import { StandingsTable } from "./standings-table";
import { StandingsSkeleton } from "./standings-skeleton";

type Props = Readonly<{
  searchParams: Promise<{ torneo: string; }>;
}>;

export const Standings: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;

  return (
    <Suspense
      key={`permalink-${tournamentPermalink}`}
      fallback={<StandingsSkeleton />}
    >
      <StandingsTable permalink={tournamentPermalink} />
    </Suspense>
  );
};

export default Standings;
