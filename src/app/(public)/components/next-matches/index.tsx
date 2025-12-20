import type { FC } from "react";
import Heading from "../heading";
import { fetchPublicMatchesAction } from "@/app/(public)/(actions)";
import { Pagination } from "@/shared/components/pagination";
import { CalendarDaysIcon, ShieldQuestion } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CurrentDayMatchesAction } from "../../(actions)/home/currentDayMatchesAction";
import { HorizontalCalendar } from "../horizontal-calendar";
import Image from "next/image";

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
          <div key={match.id} className="flex flex-col gap-3 text-neutral-800">
            <div className="grid grid-cols-[1fr_1fr_250px_1fr] items-center">
              <div className="flex flex-col gap-1">
                <Heading level="h3" className="text-lg">{match.tournament.name}</Heading>
                <p><b>Division:</b> {match.localTeam.division}</p>
                <p><b>Jornada:</b> {match.week}</p>
                <p><b>Lugar:</b> {match.place ?? <span>No especificado</span>}</p>
              </div>
              <div className="flex justify-start items-center gap-5">
                {match.localTeam.imageUrl ? (
                  <Image
                    src={match.localTeam.imageUrl}
                    width={100}
                    height={100}
                    alt={`${match.localTeam.name} escudo`}
                    className="size-[100px] object-cover rounded"
                  />
                ) : (
                  <ShieldQuestion className="text-gray-400" />
                )}
                <p className="text-2xl font-semibold italic text-blue-900">{match.localTeam.name}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="font-semibold italic text-center">
                  {match.matchDate ? (
                    <p className="text-gray-600">
                      <span>
                        {` ${format(match.matchDate, 'dd', { locale: es })} `}
                      </span>
                      <span>{' de '}</span>
                      <span className="capitalize">
                        {format(match.matchDate, "LLLL", { locale: es })}
                      </span>
                      <span>
                        &nbsp;{format(match.matchDate, "y", { locale: es })}
                      </span>
                    </p>
                  ) : (
                    <p className="text-gray-600">No definido</p>
                  )}
                </div>
                {match.matchDate ? (
                  <div className="text-2xl italic">
                    <span className="font-bold text-blue-800">{format(new Date(match.matchDate), 'h')}</span>:
                    <span>{format(match.matchDate, 'mm')}</span>
                    <span>&nbsp;{format(match.matchDate, 'bbb', { locale: es })}</span>
                  </div>
                ) : (
                  <div className="text-2xl italic">No Definido</div>
                )}
              </div>
              <div className="flex justify-start items-center gap-5">
                <p className="text-2xl font-semibold italic text-blue-900">{match.visitorTeam.name}</p>
                {match.visitorTeam.imageUrl ? (
                  <Image
                    src={match.visitorTeam.imageUrl}
                    width={100}
                    height={100}
                    alt={`${match.visitorTeam.name} escudo`}
                    className="size-[100px] object-cover rounded"
                  />
                ) : (
                  <ShieldQuestion className="text-gray-400" />
                )}
              </div>
            </div>
            {((matches.length - 1) !== index) && (
              <div className="w-full h-0.5 bg-gray-300 my-3" />
            )}
          </div>
        )): (
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