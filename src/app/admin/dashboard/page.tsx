import { Suspense } from "react";
import ActiveTournaments from "./(components)/active-tournaments";
import TournamentsSkeleton from "./(components)/active-tournaments/TournamentsSkeleton";
import { LatestResults } from "./(components)/latest-results";
import { LeadingTeams } from "./(components)/leading-teams";
import { LeadingSkeleton } from "./(components)/leading-teams/leading-skeleton";
import { LatestMessages } from "./(components)/latest-messages";
import { MessagesSkeleton } from "./(components)/latest-messages/messages-skeleton";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const DashboardPage = async () => {
  const session = await auth.api.getSession({
		headers: await headers(),
	});

  if (!session) {
		redirect("/login");
	}

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="grid auto-rows-min gap-5 md:grid-cols-2">
        <section className="bg-muted/50 max-h-[400px] flex-1 rounded-xl md:min-h-min p-5">
          <Suspense fallback={<LeadingSkeleton />}>
            <LeadingTeams />
          </Suspense>
        </section>
        <section className="bg-muted/50 max-h-[400px] rounded-xl p-5">
          <Suspense fallback={<MessagesSkeleton />}>
            <LatestMessages />
          </Suspense>
        </section>
      </div>
      <div className="flex-1 grid gap-5 md:grid-cols-2">
        <section className="bg-muted/50 max-h-[720px] rounded-xl p-5">
          <Suspense fallback={<TournamentsSkeleton />}>
            <ActiveTournaments />
          </Suspense>
        </section>
        <section className="bg-muted/50 max-h-[720px] flex-1 rounded-xl md:min-h-min p-5">
          <Suspense fallback={<TournamentsSkeleton />}>
            <LatestResults />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
