'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { Badge } from '@/components/ui/badge';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import type { STAGE_TYPE } from '@/shared/enums';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  tournament: TOURNAMENT_TYPE;
}>;

type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
  imageUrl: string | null;
  country: string | null;
  cities: string[];
  season: string | null;
  stage: STAGE_TYPE;
  startDate: Date;
  endDate: Date;
  categories: {
    id: string;
    name: string;
    permalink: string;
  }[];
};

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
        <p><b>Ciudades:</b> {tournament.cities}</p>
        <p><b>Temporada:</b> {tournament.season}</p>
        <p><b>Etapa:</b> {tournament.stage}</p>
        <p><b>Fecha Inicial:</b> {
          formatInTimeZone(tournament.startDate, "dd 'de' MM, yyyy", TIME_ZONE, { locale: es })
        }</p>
        <p><b>Fecha Final:</b> {
          formatInTimeZone(tournament.endDate, "dd 'de' MM, yyyy", TIME_ZONE, { locale: es })
        }</p>
      </div>

      <h3>Categorías</h3>

      <div className="flex flex-wrap gap-2">
        {
          tournament.categories.map(({ id, name }) => (
            <Badge key={id} variant="outline-info">
              {name}
            </Badge>
          ))
        }
      </div>
    </section>
  );
};
