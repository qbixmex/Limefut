import type { FC } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TbSoccerField } from 'react-icons/tb';
import { getMatchStatus } from '@/app/admin/encuentros/(helpers)/place';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import type { MATCH_TYPE } from '../../(actions)/fetch-playoff-match.action';
import { fetchPlayoffMatchAction } from '../../(actions)/fetch-playoff-match.action';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  params: Promise<{
    match_id: string;
    playoff_id: string;
  }>;
}>;

export const PlayoffMatchContent: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const { playoff_id: playoffId, match_id: matchId } = await params;

  const response = await fetchPlayoffMatchAction({
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
    playoffId,
    matchId,
  });

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(response.message)}`);
  }

  const match = response.match as MATCH_TYPE;

  return (
    <>
      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <div className="bg-gray-200 dark:bg-green-900/40 size-[512px] rounded-xl flex items-center justify-center">
          <TbSoccerField size={480} strokeWidth={1} className="text-gray-400" />
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="font-semibold w-[180px]">Encuentro</TableHead>
              <TableCell className="flex items-center gap-3 font-semibold text-gray-200">
                <Link
                  href={ROUTES.ADMIN_TEAMS_SHOW(match.local.id)}
                  className="text-wrap"
                  target="_blank"
                >
                  {match.local.name}
                </Link>
                <Badge variant="outline-info">{match.localScore}</Badge>
                <Minus strokeWidth={2} />
                <Badge variant="outline-info">{match.visitorScore}</Badge>
                <Link
                  href={ROUTES.ADMIN_TEAMS_SHOW(match.visitor.id)}
                  className="text-wrap"
                  target="_blank"
                >
                  {match.visitor.name}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Arbitro</TableHead>
              <TableCell>
                {match.referee ?? (
                  <span className="text-gray-500 italic">No definido</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Cancha</TableHead>
              <TableCell>
                {match.field ? (
                  <Link
                    href={`${ROUTES.ADMIN_FIELDS_SHOW(match.field.id)}`}
                    target="_blank"
                  >
                    {match.field.name}
                  </Link>
                ) : (
                  <span className="text-gray-500 italic">No definida</span>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Fecha del Encuentro</TableHead>
              <TableCell>
                {
                  match.matchDate
                    ? format(match.matchDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                    : <span className="text-gray-500 italic">No Proporcionada</span>
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Hora</TableHead>
              <TableCell>
                {
                  match.matchDate
                    ? formatInTimeZone(match.matchDate, TIME_ZONE, 'h:mm a', { locale: es })
                    : <span className="text-gray-500 italic">No proporcionada</span>
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableCell>
                <Badge variant={getMatchStatus(match.status).variant}>
                  {getMatchStatus(match.status).label}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="font-semibold">Comentarios</TableHead>
              <TableCell>
                {
                  match.remarks ? (
                    <p className="text-gray-500 text-wrap">{match.remarks}</p>
                  ) : (
                    <p className="text-gray-500 text-wrap">sin comentarios</p>
                  )
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px] font-semibold">Creado en:</TableHead>
              <TableCell>
                {format(new Date(match.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead className="w-[180px] font-semibold">Actualizado en:</TableHead>
              <TableCell>
                {format(new Date(match.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* {(
        (match.status === MATCH_STATUS.COMPLETED) &&
        (match.localScore === match.visitorScore)
      ) && (
          <>
            <h2 className="text-lg font-bold text-sky-500 mb-5">Tanda de Penales</h2>

            <section className="flex flex-col lg:flex-row gap-5">
              <div className="w-full lg:w-1/2">
                <PenaltyShootout shootout={match.penaltyShootout} />
              </div>
            </section>
          </>
        )} */}
    </>
  );
};
