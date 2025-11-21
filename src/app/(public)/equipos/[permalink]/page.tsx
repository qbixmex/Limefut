import { type FC, Suspense } from "react";
import { TeamDetails } from "./(components)/team-details";
import { TeamSkeleton } from "./(components)/team-skeleton";

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

const TeamPage: FC<Props> = async ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Suspense fallback={<TeamSkeleton />}>
        <TeamDetails params={params} />
      </Suspense>
    </div>
  );
};

export default TeamPage;