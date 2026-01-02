import type { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchTeamsAction } from "../(actions)/fetchTeamsAction";
import { ShieldBan } from "lucide-react";

type TeamsListProps = Readonly<{
  tournamentPermalink?: string;
  category?: string;
  format?: string;
}>;

export const TeamsList: FC<TeamsListProps> = async ({
  tournamentPermalink,
  category,
  format,
}) => {
  if (!tournamentPermalink || !category || !format) {
    return null;
  }

  const { teams } = await fetchTeamsAction(tournamentPermalink, category, format);

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-5">
        {teams.map((team) => (
          <div key={team.id} className="flex flex-col items-center gap-5">
            <figure>
              {(!team.imageUrl) ? (
                <div className="size-[250px] text-gray-400 bg-gray-200 dark:bg-gray-700 rounded grid place-content-center">
                  <Link
                    href={
                      `/equipos/${team.permalink}`
                      + `?torneo=${tournamentPermalink}`
                      + `&categoria=${team.category}`
                      + `&formato=${team.format}`
                    }
                  >
                    <ShieldBan size={250} strokeWidth={1} className="text-gray-500" />
                  </Link>
                </div>
              ) : (
                <Link
                  href={
                    `/equipos/${team.permalink}`
                    + `?torneo=${tournamentPermalink}`
                    + `&categoria=${team.category}`
                    + `&formato=${team.format}`
                  }
                  >
                  <Image
                    src={team.imageUrl as string}
                    width={250}
                    height={250}
                    alt={`Equipo ${team.name}`}
                    className="size-[250px] rounded"
                  />
                </Link>
              )}
            </figure>
            <Link
              href={
                `/equipos/${team.permalink}`
                + `?torneo=${tournamentPermalink}`
                + `&categoria=${team.category}`
                + `&formato=${team.format}`
              }
              className="italic font-bold"
            >
              {team.name}
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};