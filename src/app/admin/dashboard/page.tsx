import { Suspense } from "react";
import ActiveTournaments from "./(components)/active-tournaments";
import TournamentsSkeleton from "./(components)/active-tournaments/TournamentsSkeleton";
import { LatestResults } from "./(components)/latest-results";

export const DashboardPage = () => {
  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-3">
        <section className="bg-muted/50 aspect-video rounded-xl p-5">
          <Suspense fallback={<TournamentsSkeleton />}>
            <ActiveTournaments />
          </Suspense>
        </section>
        <section className="bg-muted/50 aspect-video rounded-xl p-5">
          <Suspense fallback={<TournamentsSkeleton />}>
            <LatestResults />
          </Suspense>
        </section>
        <section className="bg-muted/50 aspect-video rounded-xl p-5"></section>
      </div>
      <div className="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min" />
    </div>
  );
};

export default DashboardPage;
