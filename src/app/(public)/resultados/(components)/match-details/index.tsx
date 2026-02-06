import type { FC } from 'react';
import Link from 'next/link';
import Image from "next/image";
import { redirect } from 'next/navigation';
import { formatInTimeZone } from "date-fns-tz";
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
import { PenaltyShootout } from "@/shared/components/penalty-shootouts";
import "./styles.css";

const TIME_ZONE = "America/Mexico_City";

type Props = Readonly<{
  matchId: string;
}>;

export const MatchDetails: FC<Props> = async ({ matchId }) => {
  const { ok, message, match } = await fetchResultDetailsAction(matchId);

  if (!ok) redirect(`/resultados?error=${encodeURIComponent(message)}`);

  const tournament = (match as MatchType).tournament;
  const localTeam = (match as MatchType).local;
  const visitorTeam = (match as MatchType).visitor;

  return (
    <>
      <section className="main-wrapper">
        <section className="w-full lg:w-1/2">
          <div className="flex relative">
            <div className="team team-local">
              <Link
                href={
                  `/equipos/${localTeam.permalink}`
                  + `?torneo=${tournament.permalink}`
                  + `&categoria=${localTeam.category}`
                  + `&formato=${localTeam.format}`
                }
                target="_blank"
              >
                <Image
                  src={localTeam.imageUrl as string}
                  width={100}
                  height={100}
                  alt={`${localTeam.name} escudo`}
                  className="size-25 rounded"
                />
              </Link>
              <div className="team-name">
                <Link
                  href={
                    `/equipos/${localTeam.permalink}`
                    + `?torneo=${tournament.permalink}`
                    + `&categoria=${localTeam.category}`
                    + `&formato=${localTeam.format}`
                  }
                  className="text-gray-100"
                  target="_blank"
                >
                  {localTeam.name}
                </Link>
              </div>
            </div>

            <div className="team team-visitor">
              <Link
                href={
                  `/equipos/${visitorTeam.permalink}`
                  + `?torneo=${tournament.permalink}`
                  + `&categoria=${visitorTeam.category}`
                  + `&formato=${visitorTeam.format}`
                }
                target="_blank"
              >
                <Image
                  src={visitorTeam.imageUrl as string}
                  width={100}
                  height={100}
                  alt={`${visitorTeam.name} escudo`}
                  className="size-25 rounded"
                />
              </Link>
              <div className="team-name">
                <Link
                  href={
                    `/equipos/${visitorTeam.permalink}`
                    + `?torneo=${tournament.permalink}`
                    + `&categoria=${visitorTeam.category}`
                    + `&formato=${visitorTeam.format}`
                  }
                  className="text-gray-100"
                  target="_blank"
                >
                  {visitorTeam.name}
                </Link>
              </div>
            </div>
            <div className="match-results">
              <p>
                <span>{match?.localScore}</span>
                <span>-</span>
                <span>{match?.visitorScore}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Torneo</TableHead>
                <TableCell>
                  <Link
                    href={
                      `/torneos/${tournament.permalink}`
                      + `?categoria=${tournament.category}`
                      + `&formato=${tournament.format}`
                    }
                    target="_blank"
                  >
                    {tournament.name}
                  </Link>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Categoría</TableHead>
                <TableCell>{tournament.category}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Formato</TableHead>
                <TableCell>{tournament.format}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>País</TableHead>
                <TableCell>{tournament.country}</TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Temporada</TableHead>
                <TableCell>{tournament.season}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      <section className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableCell>
                  <p className="text-gray-200">
                    <span>
                      {`${formatInTimeZone(match?.matchDate as Date, TIME_ZONE, 'dd', { locale: es })}`}
                    </span>
                    <span>{' de '}</span>
                    <span className="capitalize">
                      {formatInTimeZone(match?.matchDate as Date, TIME_ZONE, "LLLL", { locale: es })}
                    </span>
                    <span>{' del '}</span>
                    <span>
                      &nbsp;{formatInTimeZone(match?.matchDate as Date, TIME_ZONE, "y", { locale: es })}
                    </span>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableCell>
                  {formatInTimeZone(match?.matchDate as Date, TIME_ZONE, "h:mm aaa", { locale: es })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Estado</TableHead>
                <TableCell>
                  <MatchStatus status={match?.status as MATCH_STATUS} />
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
                <TableHead>Lugar</TableHead>
                <TableCell>{match?.place ?? 'No especificado'}</TableCell>
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
            (match?.status === MATCH_STATUS.COMPLETED)
            && (match.localScore === match.visitorScore)
          ) && (
            <>
              <div className="w-full h-0.25 bg-gray-600 my-5"></div>
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

export default MatchDetails;
