import { Suspense, type FC } from "react";
import { TeamsSkeleton } from "./TeamsSkeleton";
import { TeamsList } from "./TeamsList";
import { ErrorHandler } from "~/src/shared/components/errorHandler";

type Props = Readonly<{
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const TeamsContent: FC<Props> = async ({ searchParams }) => {
  const params = await searchParams;

  return (
    <Suspense
      key={`tournament-${params.torneo}-category-${params.categoria}-formato-${params.formato}`}
      fallback={<TeamsSkeleton />}
    >
      <ErrorHandler />
      <TeamsList
        tournamentPermalink={params.torneo}
        category={params.categoria}
        format={params.formato}
      />
    </Suspense>
  );
};

export default TeamsContent;
