import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchTeamsAction } from "../(actions)/fetchTeamsAction";
import { Shield } from "lucide-react";

type TeamsListProps = Readonly<{
  permalink?: string;
}>;

export const TeamsList: FC<TeamsListProps> = async ({ permalink }) => {
  if (!permalink) return null;

  const { teams } = await fetchTeamsAction(permalink);

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
    <div className="flex flex-col gap-5">
      {
        teams.map((team) => (
          <div key={team.id} className="flex items-center gap-5">
            <figure>
              {(!team.imageUrl) ? (
                <div className="size-[50px] bg-gray-700 rounded grid place-content-center">
                  <Shield size={40} strokeWidth={1} />
                </div>
              ) : (
                <Image
                  src={team.imageUrl as string}
                  width={50}
                  height={50}
                  alt={`Equipo ${team.name}`}
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