'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { es } from 'date-fns/locale';
import { format } from 'date-fns-tz';
import type { TOURNAMENT_TYPE } from '../(actions)/fetchTournamentsAction';

type Props = Readonly<{
  tournament: TOURNAMENT_TYPE;
}>;

export const Tournament: FC<Props> = ({ tournament }) => {
  const router = useRouter();

  const onTournamentSelected = () => {
    router.push(`${ROUTES.PUBLIC_TOURNAMENTS}/${tournament.permalink}`);
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
            <Trophy
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
        <p><b>País:</b> {tournament.country}</p>
        <p><b>Fecha Inicial:</b>
          {format(tournament.startDate, "dd 'de' MMMM, yyyy", { locale: es })}
        </p>
        <p><b>Fecha Final:</b>
          {format(tournament.endDate, "dd 'de' MMMM, yyyy", { locale: es })}
        </p>
        <p><b>Temporada:</b> {tournament.season}</p>
      </div>
    </section>
  );
};
