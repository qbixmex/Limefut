import type { FC } from "react";
import { fetchPublicLatestMatchesAction } from "@/app/(public)/(actions)";
import { Pagination } from "@/shared/components/pagination";
import { GameScore } from "@/shared/components/icons";
import Link from "next/link";
import { Team } from "../results/team";
import { MatchMetadata } from "../results/match-metadata";

type Props = Readonly<{
  resultsPromise: Promise<{ latestResultsPage: string }>;
}>;

export const LatestResults: FC<Props> = async ({ resultsPromise }) => {
  const { latestResultsPage } = await resultsPromise;
  const { matches, pagination } = await fetchPublicLatestMatchesAction({
    take: 4,
    nextMatches: Number(latestResultsPage),
  });

  return (
    <section>
      <div className="bg-emerald-700 text-emerald-50 px-5 py-3 rounded-t-lg flex items-center gap-3">
        <GameScore size={50} strokeWidth={1.5} />
        <p className="font-bold text-2xl">Resultados Recientes</p>
      </div>

      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length === 0) && (
          <div className="text-emerald-800 dark:text-emerald-600 text-center font-bold text-xl italic">
            ¡ No hay encuentros recientes !
          </div>
        )}

        {(matches.length > 0) && matches.map((match, index) => (
          <Link
            key={match.id}
            href={
              `/resultados/${match.id}/`
              + `${match.localTeam.permalink}`
              + `-vs-`
              + `${match.localTeam.permalink}`
            }
            target="_blank"
          >
            <div className="flex flex-col gap-3 text-gray-800 dark:text-gray-200">
              <div className="flex flex-col gap-5 md:flex-row md:gap-5">
                <div className="w-full lg:w-1/2 order-2 lg:order-1">
                  <MatchMetadata
                    tournamentName={match.tournament.name}
                    category={match.localTeam.category}
                    format={match.localTeam.format}
                    week={match.week}
                    place={match.place}
                    date={match.matchDate}
                  />
                </div>
                <div className="w-full lg:w-1/2 grid grid-cols-3 order-1 lg:order-2">
                  <Team
                    imageUrl={match.localTeam.imageUrl}
                    name={match.localTeam.name}
                  />
                  <div className="flex justify-center items-center gap-2 font-bold text-2xl">
                    <span className="text-blue-700 dark:text-blue-500">
                      {match.localScore}
                    </span>
                    <span>-</span>
                    <span className="text-blue-700 dark:text-blue-500">
                      {match.visitorScore}
                    </span>
                  </div>
                  <Team
                    imageUrl={match.visitorTeam.imageUrl}
                    name={match.visitorTeam.name}
                  />
                </div>
              </div>
              {((matches.length - 1) !== index) && (
                <div className="w-full h-0.5 bg-gray-300 my-3" />
              )}
            </div>
          </Link>
        ))}
      </div>
      {(pagination.totalPages > 1) && (
        <section className="flex justify-center mt-5">
          <Pagination totalPages={pagination.totalPages} propName="latest-results" />
        </section>
      )}
    </section>
  );
};

export default LatestResults;
