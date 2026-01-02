import type { FC } from 'react';
import { fetchResultDetailsAction, type MatchType } from '../(actions)/fetchResultDetailsAction';
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
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-1/2">
          <div className="flex relative">
            <div className="flex justify-center items-center w-1/2 bg-emerald-800/60 h-[250px] rounded-l-xl">
              <div className="space-y-5">
                <Image
                  src={localTeam.imageUrl as string}
                  width={100}
                  height={100}
                  alt={`${localTeam.name} escudo`}
                  className="size-25 rounded"
                />
                <p className="text-center font-semibold">
                  {localTeam.name.slice(0, 18)} ...
                </p>
              </div>
            </div>

            <div className="flex justify-center items-center w-1/2 bg-emerald-800/70 h-[250px] rounded-r-xl">
              <div className="flex flex-col justify-center items-center gap-5">
                <Image
                  src={visitorTeam.imageUrl as string}
                  width={100}
                  height={100}
                  alt={`${visitorTeam.name} escudo`}
                  className="size-25 rounded"
                />
                <p className="text-center font-semibold">
                  {visitorTeam.name.slice(0, 18)} ...
                </p>
              </div>
            </div>
            <div className="absolute left-[50%] top-[50%] -translate-[50%] size-25 bg-blue-950 text-xl flex justify-center items-center rounded-xl">
              <p className="text-4xl text-blue-50 font-semibold">
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
                <TableHead>Country</TableHead>
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
                  {match?.status}
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
