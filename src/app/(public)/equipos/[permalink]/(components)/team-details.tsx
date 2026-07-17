import type { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { type TEAM_TYPE, fetchTeamAction } from '../../(actions)/fetchTeamAction';
import { redirect } from 'next/navigation';
import { ShieldBan, Table2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Heading } from '@/app/(public)/components';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';
import { TeamStandings } from './teams-standings';
import { LastResults } from './last-results';
import { NextMatches } from './next-matches';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
  searchParams: Promise<{
    tournament?: string;
    category?: string;
  }>;
}>;

export const TeamDetails: FC<Props> = async ({ params, searchParams }) => {
  const permalink = (await params).permalink;
  const {
    tournament: tournamentPermalink,
    category: categoryPermalink,
  } = await searchParams;

  if (!tournamentPermalink || !categoryPermalink) {
    redirect(`${ROUTES.PUBLIC_TEAMS}/?error=${encodeURIComponent(
      '¡ El torneo y categoría son obligatorios !',
    )}`);
  }

  const responseTeam = await fetchTeamAction({
    permalink,
    tournamentPermalink,
    categoryPermalink,
  });

  if (!responseTeam.team && !responseTeam.ok) {
    redirect(
      `${ROUTES.PUBLIC_TEAMS}?error=${encodeURIComponent(responseTeam.message)}`,
    );
  }

  const team = responseTeam.team as TEAM_TYPE;

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
                <TableHead className="font-semibold">Categoría</TableHead>
                <TableCell>
                  {
                    team.category ? (
                      <Badge variant="outline-info">
                        {team.category.name}
                      </Badge>
                    ) : (
                      <span className="text-gray-500 italic">Aun no asignada</span>
                    )
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
                    team?.country ?? (
                      <span className="text-gray-500 italic">No especificado</span>
                    )
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Estado</TableHead>
                <TableCell>
                  {
                    team?.state ?? (
                      <span className="text-gray-500 italic">No especificado</span>
                    )
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
                    team?.city ?? (
                      <span className="text-gray-500 italic">No especificada</span>
                    )
                  }
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="font-semibold">Torneo</TableHead>
                <TableCell>
                  {team?.tournament ? (
                    <Link
                      href={
                        ROUTES.PUBLIC_TOURNAMENTS +
                        `/${team?.tournament.permalink}`
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
                    <Badge variant="outline-secondary">No asignado</Badge>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead className="w-[120px] font-semibold">
                  Sede{team!.fields.length > 1 ? 's' : ''}
                </TableHead>
                <TableCell className="flex flex-col gap-2">
                  {(team!.fields.length > 0) ? team!.fields.map((field) => (
                    <Badge key={field.id} variant="outline-info">{field.name}</Badge>
                  )) : (
                    <Badge variant="outline-secondary">No asignada</Badge>
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

      <section className="mb-10">
        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold mb-3">Estadísticas</h2>
          {(team.tournament && team.category) && (
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={
                    ROUTES.PUBLIC_STANDINGS +
                    `?tournament=${team.tournament?.permalink}` +
                    `&category=${team.category?.permalink}`
                  }
                  target="_blank"
                  className={buttonVariants({
                    variant: 'outline-info',
                    size: 'icon',
                  })} rel="noreferrer"
                >
                  <Table2 />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="left">
                Ver tabla de posiciones
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        <TeamStandings
          teamId={team.id}
          tournamentId={team.tournament?.id as string}
          categoryId={team.category?.id as string}
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <LastResults matches={team.matches} />
        <NextMatches matches={team.matches} />
      </section>
    </div>
  );
};
