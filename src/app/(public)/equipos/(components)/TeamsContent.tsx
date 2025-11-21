import { Suspense, type FC } from "react";
import { TeamsSkeleton } from "./TeamsSkeleton";
import { TeamsList } from "./TeamsList";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;

  return (
    <Suspense
      key={`permalink-${tournamentPermalink}`}
      fallback={<TeamsSkeleton />}
    >
      <TeamsList permalink={tournamentPermalink} />
    </Suspense>
  );
};

export default TeamsContent;
