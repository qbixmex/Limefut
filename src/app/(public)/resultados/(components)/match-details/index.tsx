import type { FC } from 'react';
import {
  type MatchType,
  fetchResultDetailsAction,
} from '../../(actions)/fetchResultDetailsAction';
import { redirect } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import Image from "next/image";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MatchStatus } from './match-status';
import type { MATCH_STATUS } from '@/shared/enums';
import "./styles.css";

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
      <div className="main-wrapper">
        <div className="w-full lg:w-1/2">
          <div className="flex relative">
            <div className="team team-local">
              <Image
                src={localTeam.imageUrl as string}
                width={100}
                height={100}
                alt={`${localTeam.name} escudo`}
                className="size-25 rounded"
              />
              <div className="team-name">
                {localTeam.name}
              </div>
            </div>

            <div className="team team-visitor">
              <Image
                src={visitorTeam.imageUrl as string}
                width={100}
                height={100}
                alt={`${visitorTeam.name} escudo`}
                className="size-25 rounded"
              />
              <div className="team-name">
                {visitorTeam.name}
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
        </div>

        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Torneo</TableHead>
                <TableCell>{tournament.name}</TableCell>
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableCell>
                  <p className="text-gray-200">
                    <span>
                      {`${format(match?.matchDate as Date, 'dd', { locale: es })}`}
                    </span>
                    <span>{' de '}</span>
                    <span className="capitalize">
                      {format(match?.matchDate as Date, "LLLL", { locale: es })}
                    </span>
                    <span>{' del '}</span>
                    <span>
                      &nbsp;{format(match?.matchDate as Date, "y", { locale: es })}
                    </span>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableCell>
                  {format(match?.matchDate as Date, "h:mm aaa", { locale: es })}
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
      </div>
    </>
  );
};

export default MatchDetails;
