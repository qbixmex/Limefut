import type { FC } from 'react';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { getPlayoffGroup, getPlayoffRound, getStageTranslation, getStatusTranslation } from '@/lib/utils';
import type { MATCH_STATUS_TYPE, ROUND_TYPE, STAGE_TYPE } from '@/shared/enums';
import { Badge } from '@/components/ui/badge';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  tournamentName: string;
  category: {
    id: string;
    name: string;
    permalink: string;
  } | null;
  place: string | null;
  date: Date | null;
  status: string;
  stage?: STAGE_TYPE;
  week?: number | null;
  round?: ROUND_TYPE;
  group?: string;
}>;

export const MatchMetadata: FC<Props> = ({
  tournamentName,
  category,
  week,
  round,
  group,
  place,
  date,
  status,
  stage,
}) => {
  return (
    <div className="h-full flex flex-col justify-center gap-2">
      <h3 className="text-lg font-semibold text-emerald-700 dark:text-primary">{tournamentName}</h3>
      <section className="flex flex-col md:flex-row text-gray-500 dark:text-gray-300">
        <div className="w-full md:1/2">
          <p><b>Categoría:</b> {category ? category.name : <span>No especificada</span>}</p>
          <p><b>Sede:</b> {place ?? <span>No especificado</span>}</p>
          {!round && !group && <MatchStatus status={status} />}
          {stage && (
            <p><b>Etapa:</b>{' '}
              <Badge variant={getStageTranslation(stage).variant}>
                {getStageTranslation(stage).label}
              </Badge>
            </p>
          )}
          {round && (<p><b>Ronda:</b> {getPlayoffRound(round)}</p>)}
          {group && (<p><b>Grupo:</b> {getPlayoffGroup(group)}</p>)}
        </div>
        <div className="w-full md:1/2">
          {round && group && <MatchStatus status={status} />}

          <p aria-label="Fecha del partido">
            <b>Fecha:</b>{' '}
            <span className="text-gray-500">
              {
                date
                  ? formatInTimeZone(date as Date, TIME_ZONE, "EEEE dd 'de' LLLL, yyyy", { locale: es })
                  : 'No disponible'
              }
            </span>
          </p>
          <p aria-label="Hora del partido">
            <b>Hora:</b>{' '}
            <span className="text-gray-500">
              {
                date
                  ? formatInTimeZone(date as Date, TIME_ZONE, 'h:mm a', { locale: es })
                  : 'No disponible'
              }
            </span>
          </p>
          {
            week && (
              <p aria-label="Jornada del partido">
                <b>Jornada:</b> {week ?? 0}
              </p>
            )
          }
        </div>
      </section>
    </div>
  );
};

const MatchStatus: FC<{ status: string }> = ({ status }) => {
  return (
    <p>
      <b>Estado:</b>&nbsp;
      <span className="capitalize italic">
        {getStatusTranslation(status as MATCH_STATUS_TYPE)}
      </span>
    </p>
  );
};
