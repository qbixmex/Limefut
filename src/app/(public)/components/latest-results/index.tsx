import type { FC } from "react";
import Heading from "../heading";
import { fetchPublicLatestMatchesAction } from "@/app/(public)/(actions)";
import { Pagination } from "@/shared/components/pagination";
import { ShieldQuestion } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { GameScore } from "@/shared/components/icons";
import Image from "next/image";

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
          <div className="text-emerald-800 text-center font-bold text-xl italic">
            ¡ No hay encuentros recientes !
          </div>
        )}

        {(matches.length > 0) && matches.map((match, index) => (
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
                <div className="flex flex-col items-center gap-3">
                  <p className="text-2xl font-semibold italic text-green-900">{match.localTeam.name}</p>
                  <p className="text-xl font-bold text-blue-600">{match.localScore}</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="font-semibold italic text-center">
                  {match.matchDate ? (
                    <>
                      <p className="text-green-950">
                        <span className="capitalize">
                          {format(match.matchDate, 'EEEE', { locale: es })}
                        </span>
                        <span>
                          {` ${format(match.matchDate, 'dd', { locale: es })} `}
                        </span>
                        <span>{' de '}</span>
                        <span className="capitalize">
                          {format(match.matchDate, "LLLL", { locale: es })}
                        </span>
                      </p>
                      <p className="text-xl text-green-900">
                        {format(match.matchDate, "y", { locale: es })}
                      </p>
                    </>
                  ) : (
                    <p className="text-green-950">No definido</p>
                  )}
                </div>
              </div>
              <div className="flex justify-start items-center gap-5">
                <div className="flex flex-col items-center gap-3">
                  <p className="text-2xl font-semibold italic text-green-900">{match.visitorTeam.name}</p>
                  <p className="text-xl font-bold text-blue-600">{match.visitorScore}</p>
                </div>
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
