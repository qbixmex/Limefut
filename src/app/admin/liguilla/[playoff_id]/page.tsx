import type { FC } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';
import type { PLAYOFF_TYPE } from '../(actions)/fetch-playoff.action';
import { fetchPlayoffAction } from '../(actions)/fetch-playoff.action';

type Props = Readonly<{
  params: Promise<{
    playoff_id: string;
  }>;
}>;

export const PlayoffPage: FC<Props> = async ({ params }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  const playoffId = (await params).playoff_id;

  const response = await fetchPlayoffAction(
    playoffId, {
    authenticatedUserId: session?.user.id,
    authenticatedUserRoles: session?.user.roles,
  });

  if (!response.ok) {
    redirect(`${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent(response.message)}`);
  }

  const playoff = response.playoff as PLAYOFF_TYPE;

  return (
    <div className="admin-page">
      <div className="admin-page-container">
        <Card className="admin-page-card">
          <CardHeader className="admin-page-card-header">
            <div className="w-full flex justify-between">
              <CardTitle className="admin-page-card-title">Detalles de la Liguilla</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <section className="flex flex-col gap-5 mb-5 lg:flex-row">
              <div className="w-full lg:w-1/2">
                <h2 className="text-xl text-gray-300/80 mb-3">
                  Posiciones de equipos en la liguilla
                </h2>

                {((playoff?.teams as PLAYOFF_TYPE['teams']).length === 0) && (
                  <Badge variant="outline-secondary">
                    no hay equipos disponibles
                  </Badge>
                )}

                <div className="w-full flex flex-col gap-2">
                  {((playoff?.teams as PLAYOFF_TYPE['teams']).length > 0) && (
                    playoff.teams.map(({ id, name }, index) => (
                      <Link key={id} href={ROUTES.ADMIN_TEAMS_SHOW(id)} target="_blank">
                        {`${index + 1}: ${name}`}
                      </Link>
                    ))
                  )}
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead>Torneo</TableHead>
                      <TableCell>
                        <Link
                          href={ROUTES.ADMIN_TOURNAMENT(playoff.tournament.id)}
                          target="_blank"
                          className="text-wrap"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayoffPage;
