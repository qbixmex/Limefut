import type { FC } from 'react';
import Image from 'next/image';
import { ShieldBan } from 'lucide-react';
import './next-match.css';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { getStatusTranslation } from '@/lib/utils';
import type { NEXT_MATCH_TYPE } from '../../(actions)/fetchNextMatchesAction';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';

type Props = Readonly<{
  match: NEXT_MATCH_TYPE;
}>;

export const NextMatch: FC<Props> = ({ match }) => {
  const { localTeam, visitorTeam, matchDetails } = match;

  return (
    <section className="next-match">
      <div className="teams">
        <div className="team-image-name">
          {
            !localTeam.imageUrl ? (
              <div className="team-no-image">
                <ShieldBan
                  size={72}
                  strokeWidth={1}
                  className="team-no-image-icon"
                />
              </div>
            ): (
              <Image
                src={localTeam.imageUrl}
                width={80}
                height={80}
                alt={`${localTeam.name} equipo local`}
                className="team-image"
              />
            )
          }
          <p className="team-name">
            {localTeam.name}
          </p>
        </div>
        <div className="versus">VS</div>
        <div className="team-image-name">
          {
            !visitorTeam.imageUrl ? (
              <div className="team-no-image">
                <ShieldBan
                  size={72}
                  strokeWidth={1}
                  className="team-no-image-icon"
                />
              </div>
            ): (
              <Image
                src={visitorTeam.imageUrl}
                width={80}
                height={80}
                alt={`${visitorTeam.name} equipo visitante`}
                className="team-image"
              />
            )
          }
          <p className="team-name">
            {visitorTeam.name}
          </p>
        </div>
      </div>
      <div className="match-data">
        <p className="match-date">
          <b>Fecha:</b>&nbsp;
          <i>
            {formatInTimeZone(
              matchDetails.matchDate as Date,
              'America/Mexico_City',
              `d 'de' LLLL 'del' yyyy`,
              { locale: es },
            )}
          </i>
        </p>
        <p>
          <b>Hora:</b>&nbsp;
          <i>
            {formatInTimeZone(
              matchDetails.matchDate as Date,
              'America/Mexico_City',
              'h:mm a',
              { locale: es },
            )}
          </i>
        </p>
        <p>
          <b>Estado:</b>&nbsp;
          <i>{getStatusTranslation(matchDetails.status as MATCH_STATUS_TYPE)}</i>
        </p>
        <p className="match-place">
          <b>Sede:</b> <i>{matchDetails.place}</i>
        </p>
        <p className="match-week">
          <b>Jornada:</b> <i>{matchDetails.week}</i>
        </p>
      </div>
    </section>
  );
};
