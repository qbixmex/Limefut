import type { FC } from "react";
import Link from "next/link";
import { fetchPublicMatchesAction } from "@/app/(public)/(actions)";
import { Pagination } from "@/shared/components/pagination";
import { CalendarDaysIcon } from "lucide-react";
import { CurrentDayMatchesAction } from "../../(actions)/home/currentDayMatchesAction";
import { HorizontalCalendar } from "../horizontal-calendar";
import { Team } from "../results/team";
import { MatchMetadata } from "../results/match-metadata";

type Props = Readonly<{
  matchesPromise: Promise<{ matchesPage: string }>;
}>;

export const NextMatches: FC<Props> = async ({ matchesPromise }) => {
  const { matchesPage } = await matchesPromise;
  const { matches, pagination } = await fetchPublicMatchesAction({
    take: 4,
    nextMatches: Number(matchesPage),
  });

  const todayMatchesCount = async () => {
    const { matchesDates } = await CurrentDayMatchesAction();
    const count = matchesDates.length;
    const pluralize = (count > 1) ? 's' : '';

    if (matchesDates.length > 0) {
      return `Hoy hay ${count} encuentro${pluralize} programado${pluralize}`;
    }
  };

  return (
    <section>
      <div className="mb-5">
        <HorizontalCalendar />
      </div>

      <div className="bg-emerald-700 text-emerald-50 px-6 py-3 rounded-t-lg flex items-center gap-4">
        <CalendarDaysIcon size={50} strokeWidth={1.5} />
        <>
          <p className="text-2xl font-semibold">Próximos Encuentros</p>
          <p className="font-semibold italic">{todayMatchesCount()}</p>
        </>
      </div>

      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length > 0) ? matches.map((match, index) => (
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
                <div className="w-full lg:w-1/2 order-2 md:order-1">
                  <MatchMetadata
                    tournamentName={match.tournament.name}
                    category={match.localTeam.category}
                    format={match.localTeam.format}
                    week={match.week}
                    place={match.place}
                    date={match.matchDate}
                    status={match.status}
                  />
                </div>
                <div className="w-full lg:w-1/2 grid grid-cols-3 order-1 md:order-2">
                  <Team
                    imageUrl={match.localTeam.imageUrl}
                    name={match.localTeam.name}
                  />
                  <div className="flex justify-center items-center gap-2 font-bold text-3xl lg:text-4xl">
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
        )) : (
          <p className="text-2xl text-green-800 font-semibold italic text-center">No hay encuentros programados</p>
        )}
      </div>
      {(pagination.totalPages > 1) && (
        <section className="flex justify-center mt-5">
          <Pagination totalPages={pagination.totalPages} propName="next-matches" />
        </section>
      )}
    </section>
  );
};

export default NextMatches;