'use client';

import type { FC } from "react";
import type { TournamentType } from "../(actions)/fetchTournamentsAction";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldBan } from "lucide-react";

type Props = Readonly<{
  tournament: TournamentType;
}>;

export const Tournament: FC<Props> = ({ tournament }) => {
  const router = useRouter();

  const onTournamentSelected = () => {
    router.push(
      `torneos/${tournament.permalink}`
      + `?categoria=${tournament.category}`
      + `&formato=${tournament.format}`,
    );
  };

  return (
    <section
      key={tournament.id}
      className="tournament"
      onClick={onTournamentSelected}
    >
      {
        (!tournament.imageUrl) ? (
          <div className="tournamentFigure">
            <ShieldBan
              strokeWidth={1}
              className="tournamentIcon"
            />
          </div>
        ) : (
          <figure className="tournamentFigure">
            <Image
              width={512}
              height={512}
              src={tournament.imageUrl}
              alt={tournament.name}
              className="tournamentImage"
            />
          </figure>
        )
      }
      <h2 className="tournamentName">
        {tournament.name}
      </h2>
      <div className="tournamentData">
        <p><b>Categoría:</b> {tournament.category}</p>
        <p><b>Formato:</b> {tournament.format} vs {tournament.format}</p>
        <p><b>Temporada:</b> {tournament.season}</p>
      </div>
    </section>
  );
};

export default Tournament;