import { Suspense, type FC } from "react";
import { TeamsSkeleton } from "./TeamsSkeleton";
import { TeamsTable } from "./TeamsTable";

type Props = Readonly<{
  searchParams: Promise<{ torneo: string; }>;
}>;

export const TeamsSelector: FC<Props> = async ({ searchParams }) => {
  const tournamentPermalink = (await searchParams).torneo;

  return (
    <>
      <Suspense
        key={`permalink-${tournamentPermalink}`}
        fallback={<TeamsSkeleton />}
      >
        <TeamsTable tournamentPermalink={tournamentPermalink} />
      </Suspense>
    </>
  );
};

export default TeamsSelector;
