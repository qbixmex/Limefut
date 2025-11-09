import type { FC } from "react";
import Heading from "../heading";
import { fetchPublicMatchesAction } from "@/app/(public)/(actions)";
import { Pagination } from "@/shared/components/pagination";
import { ShieldQuestion } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  matchesPromise: Promise<{ matchesPage: string }>;
}>;

export const NextMatches: FC<Props> = async ({ matchesPromise }) => {
  const { matchesPage } = await matchesPromise;
  const { matches, pagination } = await fetchPublicMatchesAction({
    take: 2,
    nextMatches: Number(matchesPage),
  });

  return (
    <section>
      <div className="bg-emerald-800 px-5 py-3 rounded-t">
        <h2 className="text-emerald-50 text-xl font-black">Próximos Encuentros</h2>
      </div>
      <div className="border border-green-900/90 rounded-b-lg p-5">
        {(matches.length === 0) && (
          <div className="text-emerald-800 text-center font-bold text-xl italic">
            Aún no hay encuentros programados
          </div>
        )}
        {(matches.length > 0) && matches.map((match, index) => (
          <div key={match.id} className="flex flex-col gap-3 text-neutral-800">
            <div className="grid grid-cols-[1fr_1fr_250px_1fr] items-center">
              <div className="flex flex-col gap-1">
                <Heading level="h3" className="text-lg">{match.tournament.name}</Heading>
                <p><b>Division:</b> {match.localTeam.division}</p>
                <p><b>Jornada:</b> {match.week}</p>
                <p><b>Lugar:</b> {match.place}</p>
              </div>
              <div className="flex justify-start items-center gap-5">
                <ShieldQuestion className="text-gray-400" />
                <p className="text-2xl font-semibold italic text-blue-900">{match.localTeam.name}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl italic">
                  <span className="font-bold text-blue-800">{format(new Date(match.matchDate), 'h')}</span>:
                  <span>{format(new Date(match.matchDate), 'mm')}</span>
                  <span>&nbsp;{format(new Date(match.matchDate), 'bbb')}</span>
                </span>
                <span className="text-2xl text-gray-800 semibold italic">
                  {format(new Date(match.matchDate), "dd-LLL-y", { locale: es })}
                </span>
              </div>
              <div className="flex justify-start items-center gap-5">
                <p className="text-2xl font-semibold italic text-blue-900">{match.visitorTeam.name}</p>
                <ShieldQuestion className="text-gray-400" />
              </div>
            </div>
            {((matches.length - 1) !== index) && (
              <div className="w-full h-0.5 bg-gray-300 my-3" />
            )}
          </div>
        ))}
      </div>
      <section className="flex justify-center mt-5">
        <Pagination totalPages={pagination.totalPages} propName="next-matches" />
      </section>
    </section>
  );
};

export default NextMatches;