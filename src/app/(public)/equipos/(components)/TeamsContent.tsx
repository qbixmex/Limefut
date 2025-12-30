import { Suspense, type FC } from "react";
import { TeamsSkeleton } from "./TeamsSkeleton";
import { TeamsList } from "./TeamsList";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const tournamentId = (await searchParams).torneo;

  return (
    <Suspense
      key={`tournamentId-${tournamentId}`}
      fallback={<TeamsSkeleton />}
    >
      <TeamsList tournamentId={tournamentId} />
    </Suspense>
  );
};

export default TeamsContent;
