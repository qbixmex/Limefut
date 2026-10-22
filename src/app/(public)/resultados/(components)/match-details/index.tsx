import type { FC } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import {
  type MatchType,
  fetchResultDetailsAction,
} from '../../(actions)/fetchResultDetailsAction';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { MatchStatus } from './match-status';
import { MATCH_STATUS } from '@/shared/enums';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { PenaltyShootout } from '@/shared/components/penalty-shootouts';
import { ROUTES } from '@/shared/constants/routes';
import './styles.css';
import { getMatchMode } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FieldsMap } from '@/shared/components/fields-map';
import { MatchResults } from '@/shared/components/match-results';
import { resolveFieldMaps } from '@/lib/maps';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  matchId: string;
}>;

export const MatchDetails: FC<Props> = async ({ matchId }) => {
  const { ok, message, match } = await fetchResultDetailsAction(matchId);

  if (!ok) {
    redirect(`${ROUTES.PUBLIC_RESULTS}?error=${encodeURIComponent(message)}`);
  }

  const tournament = (match as MatchType).tournament;
  const localTeam = (match as MatchType).local;
  const visitorTeam = (match as MatchType).visitor;
  const matchField = (match as MatchType).field;
  const fieldMaps = matchField ? await resolveFieldMaps([matchField]) : [];

  return (
    <>
      <section className="main-wrapper">
        <section className="w-full lg:w-1/2">
          <MatchResults
            local={{
              name: localTeam.name,
              href:
                `${ROUTES.PUBLIC_TEAMS}/${localTeam.permalink}` +
                `?tournament=${tournament.permalink}` +
                `&category=${localTeam.category?.permalink}`,
              imageUrl: localTeam.imageUrl,
            }}
            visitor={{
              name: visitorTeam.name,
              href:
                `${ROUTES.PUBLIC_TEAMS}/${visitorTeam.permalink}` +
                `?tournament=${tournament.permalink}` +
                `&category=${visitorTeam.category?.permalink}`,
              imageUrl: visitorTeam.imageUrl,
            }}
            localScore={match?.localScore}
            visitorScore={match?.visitorScore}
          />
        </section>

        <section className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Torneo</TableHead>
                <TableCell>
                  <Link
                    href={ROUTES.PUBLIC_TOURNAMENT_SHOW(tournament.permalink)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <p className="text-balance">{tournament.name}</p>
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableCell>{match?.category?.name ?? 'No definida'}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Formato</TableHead>
                <TableCell>
                  {match?.local.format} vs {match?.visitor.format}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>País</TableHead>
                <TableCell>{tournament.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Temporada</TableHead>
                <TableCell>{tournament.season}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Modalidad</TableHead>
                <TableCell>
                  <Badge
                    variant={
                      ((match as MatchType).mode === 'league')
                        ? 'outline-primary'
                        : 'outline-special'
                    }
                    className="uppercase font-semibold w-25"
                  >
                    {getMatchMode((match as MatchType).mode)}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      {fieldMaps.length > 0 && (
        <FieldsMap maps={fieldMaps} className="my-10" />
      )}

      <h2 className="text-lg font-bold text-sky-500">Información Adicional</h2>

      <section className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableCell>
                  <p className="dark:text-gray-200">
                    <span>
                      {`${formatInTimeZone(match?.matchDate as Date, TIME_ZONE, 'dd', { locale: es })}`}
                    </span>
                    <span>{' de '}</span>
                    <span className="capitalize">
                      {formatInTimeZone(match?.matchDate as Date, TIME_ZONE, 'LLLL', { locale: es })}
                    </span>
                    <span>{' del '}</span>
                    <span>
                      &nbsp;{formatInTimeZone(match?.matchDate as Date, TIME_ZONE, 'y', { locale: es })}
                    </span>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableCell>
                  {formatInTimeZone(match?.matchDate as Date, TIME_ZONE, 'h:mm aaa', { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableCell>
                  <MatchStatus status={match?.status as MATCH_STATUS_TYPE} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Jornada</TableHead>
                <TableCell>{match?.week ?? 'No especificada'}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Sede</TableHead>
                <TableCell>{match?.field?.name ?? 'No especificado'}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Arbitro</TableHead>
                <TableCell>{match?.referee ?? 'No especificado'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        {
          (
            (match?.status === MATCH_STATUS.COMPLETED) &&
            (match.localScore === match.visitorScore)
          ) && (
            <>
              <div className="w-full h-0.25 bg-gray-600 my-5" />
              <h2 className="text-lg font-bold text-sky-500 mb-5">Tanda de Penales</h2>
              <section className="flex flex-col lg:flex-row gap-5">
                <div className="w-full lg:w-1/2">
                  <PenaltyShootout shootout={match.penaltyShootout} />
                </div>
              </section>
            </>
          )
        }
      </section>
    </>
  );
};
