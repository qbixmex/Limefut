'use client';

import { useState, type FC } from 'react';
import Image from 'next/image';
import { ShieldBan } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { cn, getStatusTranslation } from '@/lib/utils';
import type { NEXT_MATCH_TYPE } from '../../(actions)/fetchNextMatchesAction';
import type { LAST_MATCH_TYPE, Team } from '../../(actions)/fetchLastMatchesAction';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import './styles.css';

type Props = Readonly<{
  match: NEXT_MATCH_TYPE | LAST_MATCH_TYPE;
  showScore?: boolean;
}>;

export const Match: FC<Props> = ({ match, showScore }) => {
  const { localTeam, visitorTeam, matchDetails } = match;
  const [showData, setShowData] = useState(false);

  return (
    <section
      className="next-match group"
      onClick={() => setShowData(prev => !prev)}
    >
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
            ) : (
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
        <div className="versus">
          {
            showScore ? (
              <div className="match-score">
                {(match as LAST_MATCH_TYPE).penaltyShoots && (
                  <span className="penalty-result">
                    ({(match as LAST_MATCH_TYPE).penaltyShoots!.localGoals})
                  </span>
                )}
                <span className="local-score">
                  {(localTeam as Team).score}
                </span>
                <span className="score-separator">-</span>
                <span className="visitor-score">
                  {(visitorTeam as Team).score}
                </span>
                {(match as LAST_MATCH_TYPE).penaltyShoots && (
                  <span className="penalty-result">
                    ({(match as LAST_MATCH_TYPE).penaltyShoots!.visitorGoals})
                  </span>
                )}
              </div>
            ) : (
              <span>VS</span>
            )
          }
        </div>
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
            ) : (
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
      <div className={cn('match-data', {
        'show-data': showData,
      })}>
        <p className="match-date">
          <b>Fecha:</b>&nbsp;
          <i>
            {formatInTimeZone(
              matchDetails.matchDate as Date,
              'America/Mexico_City',
              'd \'de\' LLLL \'del\' yyyy',
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
