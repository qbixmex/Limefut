import type { FC } from 'react';
import Image from "next/image";
import { fetchTeamAction } from '../../(actions)/fetchTeamAction';
import { redirect } from 'next/navigation';
import { Flag } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '~/src/components/ui/table';
import Link from 'next/link';
import { Badge } from '~/src/components/ui/badge';
import { Heading } from '../../../components';
import BackButton from './back-button';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const TeamDetails: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;
  const { team } = await fetchTeamAction(permalink);

  if (!team) {
    redirect("/equipos");
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-5 pt-0">
      <div className="flex items-center gap-5 mb-5">
        <BackButton permalink={team.tournament?.permalink ?? ''} />
        <Heading level="h1" className="text-emerald-500">
          {team.name}
        </Heading>
      </div>
      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <section className="w-full md:max-w-[400px] flex justify-center">
          {!team.imageUrl ? (
            <div className="bg-gray-200 dark:bg-gray-800 size-[512px] rounded-xl flex items-center justify-center">
              <Flag size={480} strokeWidth={1} className="stroke-gray-400" />
            </div>
          ) : (
            <Image
              src={team.imageUrl}
              width={400}
              height={400}
              alt={`imagen de perfil de ${team.name}`}
              className="rounded-lg size-[400px] object-cover"
            />
          )}
        </section>

        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">Sede</TableHead>
                <TableCell>
                  {
                    team.headquarters
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">División</TableHead>
                <TableCell>
                  {
                    team.division
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Grupo</TableHead>
                <TableCell>
                  {
                    team.group
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">País</TableHead>
                <TableCell>
                  {
                    team.country
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableCell>
                  {
                    team.state
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">City</TableHead>
                <TableCell>
                  {
                    team.city
                    ?? <span className="text-gray-500 italic">No especificada</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Torneo</TableHead>
                <TableCell>
                  {team.tournament ? (
                    <Link
                      href={`/torneos/${team.tournament.permalink}`}
                      className="text-wrap"
                    >
                      {team.tournament.name}
                    </Link>
                  ) : (
                    <Badge variant="outline-secondary">No Asignado</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Entrenador</TableHead>
                <TableCell>
                  {(team.coach) ? (
                    <Link href="#">
                      {team.coach.name}
                    </Link>
                  ) : (
                    <Badge variant="outline-secondary">No Asignado</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Dirección</TableHead>
                <TableCell>
                  <span className="text-wrap">
                    {
                      team.address
                      ?? <span className="text-gray-500 italic">No especificada</span>
                    }
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      <section>
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/2">
            <h2 className="text-xl font-bold text-sky-600 mb-5">Jugadores</h2>
            {
              !team.players ? (
                <div className="border-2 border-cyan-600 rounded-lg px-2 py-4">
                  <p className="text-cyan-600 text-center font-bold">Aún no hay jugadores registrados</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {team.players.map(({ id, name }) => (
                    <Link key={id} href={`/admin/jugadores/perfil/${id}`}>
                      <Badge variant="outline-info">{name}</Badge>
                    </Link>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      </section>
    </div>
  );
};

export default TeamDetails;
