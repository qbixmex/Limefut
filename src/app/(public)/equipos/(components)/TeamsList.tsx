import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchTeamsAction } from "../(actions)/fetchTeamsAction";
import { Shield } from "lucide-react";

type TeamsListProps = Readonly<{
  tournamentId?: string;
}>;

export const TeamsList: FC<TeamsListProps> = async ({ tournamentId }) => {
  if (!tournamentId) return null;

  const { teams } = await fetchTeamsAction(tournamentId);

  if (teams.length == 0) {
    return (
      <div className="border-2 border-blue-500 py-5 rounded-lg">
        <p className="text-blue-500 font-bold text-center">
          Aún no hay equipos para este torneo
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-10 mt-5">
      {
        teams.map((team) => (
          <div key={team.id} className="flex flex-col items-center gap-5">
            <figure>
              {(!team.imageUrl) ? (
                <div className="size-[50px] text-gray-400 bg-gray-200 dark:bg-gray-700 rounded grid place-content-center">
                  <Shield size={40} strokeWidth={1} />
                </div>
              ) : (
                <Image
                  src={team.imageUrl as string}
                  width={250}
                  height={250}
                  alt={`Equipo ${team.name}`}
                  className="size-[250px] rounded"
                />
              )}
            </figure>
            <Link
              href={`/equipos/${team.permalink}`}
              className="italic font-bold"
            >
              {team.name}
            </Link>
          </div>
        ))
      }
    </div>
  );
};