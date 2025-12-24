import { Suspense } from "react";
import ActiveTournaments from "./(components)/active-tournaments";
import TournamentsSkeleton from "./(components)/active-tournaments/TournamentsSkeleton";

export const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-3">
        <div className="bg-muted/50 aspect-video rounded-xl p-5">

          <Suspense fallback={<TournamentsSkeleton />}>
            <ActiveTournaments />
          </Suspense>
        </div>
        <div className="bg-muted/50 aspect-video rounded-xl" />
        <div className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
};

export default DashboardPage;
