'use client';

import type { FC } from "react";
import type { TournamentType } from "../(actions)/fetchTournamentsAction";
import { useRouter } from "next/navigation";

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
      <h2 className="tournamentName">
        {tournament.name}
      </h2>
      <div className="tournamentData">
        <p><b>Categoría:</b> {tournament.category}</p>
        <p><b>Formato:</b> {tournament.format}</p>
        <p><b>Temporada:</b> {tournament.season}</p>
      </div>
    </section>
  );
};

export default Tournament;