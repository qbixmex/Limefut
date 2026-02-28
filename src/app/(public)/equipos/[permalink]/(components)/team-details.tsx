import type { FC } from 'react';
import Image from 'next/image';
import { fetchTeamAction } from '../../(actions)/fetchTeamAction';
import { redirect } from 'next/navigation';
import { ShieldBan } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '~/src/components/ui/table';
import Link from 'next/link';
import { Badge } from '~/src/components/ui/badge';
import { Heading } from '../../../components';
import { NextMatch } from './next-match';
import { fetchNextMatchesAction } from '../(actions)/fetchNextMatchesAction';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
  searchParams: Promise<{
    torneo?: string;
    categoria?: string;
    formato?: string;
  }>;
}>;

export const TeamDetails: FC<Props> = async ({ params, searchParams }) => {
  const permalink = (await params).permalink;
  const {
    torneo: tournamentPermalink,
    categoria: category,
    formato: format,
  } = await searchParams;

  if (!tournamentPermalink || !category || !format) {
    redirect(`/equipos?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  };

  const { ok, message, team } = await fetchTeamAction({
    permalink,
    tournamentPermalink,
    category,
    format,
  });

  if (!team && !ok) {
    redirect(`/equipos?error=${encodeURIComponent(message)}`);
  }

  const responseNextMatches = await fetchNextMatchesAction({
    teamId: team!.id,
    count: 3,
  });

  if (!responseNextMatches.ok) {
    redirect(`/equipos?error=${encodeURIComponent(responseNextMatches.message)}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-0 lg:p-5">
      <div className="flex items-center gap-5 mb-5">
        <Heading level="h1" className="text-emerald-500">
          {team?.name}
        </Heading>
      </div>
      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <section className="w-full md:max-w-[400px] flex justify-center">
          {!team?.imageUrl ? (
            <div className="bg-gray-200 dark:bg-gray-800 size-[400px] rounded-xl flex items-center justify-center">
              <ShieldBan size={400} strokeWidth={1} className="stroke-gray-400" />
            </div>
          ) : (
            <Image
              src={team.imageUrl}
              width={400}
              height={400}
              alt={`${team.name} equipo`}
              className="rounded-lg w-full lg:max-w-100 h-auto object-cover"
            />
          )}
        </section>

        <section className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">Sede</TableHead>
                <TableCell>
                  <span className="text-wrap dark:text-gray-200 italic">
                    {team?.headquarters ?? 'No especificado'}
                  </span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Categoría</TableHead>
                <TableCell>
                  {
                    team?.category
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Formato</TableHead>
                <TableCell>
                  {
                    team?.format
                      ? `${team?.format} vs ${team?.format}`
                      : <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Rama</TableHead>
                <TableCell>
                  {
                    (team?.gender === 'male')
                      ? 'Varonil'
                      : (team?.gender === 'female')
                        ? 'Femenil'
                        : 'No especificado'
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">País</TableHead>
                <TableCell>
                  {
                    team?.country
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableCell>
                  {
                    team?.state
                    ?? <span className="text-gray-500 italic">No especificado</span>
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">Ciudad</TableHead>
                <TableCell>
                  {
                    team?.city
                    ?? <span className="text-gray-500 italic">No especificada</span>
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Torneo</TableHead>
                <TableCell>
                  {team?.tournament ? (
                    <Link
                      href={
                        `/torneos/${team?.tournament.permalink}`
                        + `?categoria=${team.tournament.category}`
                        + `&formato=${team.tournament.format}`
                      }
                      className="text-wrap"
                    >
                      {team?.tournament.name}
                    </Link>
                  ) : (
                    <Badge variant="outline-secondary">No Asignado</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Entrenador</TableHead>
                <TableCell>
                  {(team?.coach) ? (
                    <Link href="#">
                      {team?.coach.name}
                    </Link>
                  ) : (
                    <Badge variant="outline-secondary">No Asignado</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Dirección</TableHead>
                <TableCell>
                  <span className="text-wrap dark:text-gray-200 italic">
                    {team?.address ?? 'No especificada'}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-5">Próximos encuentros:</h2>

        {(responseNextMatches.matches.length === 0) && (
          <div className="w-fit px-5 py-2.5 border border-sky-500 rounded mb-5">
            <p className="text-sky-500 font-bold italic">Aún no hay encuentros programados</p>
          </div>
        )}

        {(responseNextMatches.matches.length > 0) && (
          <div className="space-y-5">
            {responseNextMatches.matches.map((match) => (
              <NextMatch key={match.id} match={match} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeamDetails;
