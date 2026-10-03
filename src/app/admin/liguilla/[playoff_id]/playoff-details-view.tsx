import type { FC } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { fetchPlayoffAction, type PLAYOFF_TYPE } from '../(actions)/fetch-playoff.action';
import { ROUTES } from '@/shared/constants/routes';
import { redirect } from 'next/navigation';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const PlayOffDetailsView: FC<Props> = async ({ params }) => {
  const playoffId = (await params).playoff_id;

  const response = await fetchPlayoffAction(playoffId);

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(response.message)}`);
  }

  const playoff = response.playoff as PLAYOFF_TYPE;

  return (
    <section className="flex flex-col gap-5 mb-5 lg:flex-row">
      <div className="w-full lg:w-1/2">
        <h2 className="text-xl text-gray-300/80 mb-3">
          Posiciones de equipos en la liguilla
        </h2>

        <div className="w-full flex flex-col gap-2">
          {
            ((playoff?.teams as PLAYOFF_TYPE['teams']).length > 0) ? (
              playoff.teams.map(({ id, name }, index) => (
                <Link
                  key={id}
                  href={ROUTES.ADMIN_TEAMS_SHOW(id)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {`${index + 1}: ${name}`}
                </Link>
              ))
            ) : (
              <Badge variant="outline-secondary">
                no hay equipos disponibles
              </Badge>
            )
          }
        </div>
      </div>
      <div className="w-full lg:w-1/2">
        <Table>
          <TableBody>
            <TableRow>
              <TableHead>Torneo</TableHead>
              <TableCell>
                <Link
                  href={ROUTES.ADMIN_TOURNAMENTS_SHOW(playoff.tournament.id)}
                  className="text-wrap"
                  target="_blank"
                  rel="noreferrer"
                >
                  {playoff.tournament.name}
                </Link>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Categoría</TableHead>
              <TableCell>
                {playoff.category ? (
                  <Badge variant="outline-info">
                    {playoff.category.name}
                  </Badge>
                ) : (
                  <Badge variant="outline-secondary">
                    no definida
                  </Badge>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Ronda Inicial</TableHead>
              <TableCell>
                <Badge variant="outline-info">
                  {playoff.startingRound}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
