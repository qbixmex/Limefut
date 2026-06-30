import type { FC } from 'react';
import {
  fetchTournamentAction,
  type TournamentType,
} from '../../(actions)/fetchTournamentAction';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Trophy, ShieldBan } from 'lucide-react';
import Link from 'next/link';
import { Heading } from '../../../components';
import { Table, TableBody, TableCell, TableHead, TableRow } from '~/src/components/ui/table';
import { ErrorHandler } from '~/src/shared/components/errorHandler';
import { format as formatDate } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { getStageTranslation } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import styles from './style.module.css';

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>;
}>;

export const Tournament: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  const response = await fetchTournamentAction(permalink);

  if (!response.ok) {
    redirect(`${ROUTES.PUBLIC_TOURNAMENTS}?error=${encodeURIComponent(response.message)}`);
  }

  const tournament = response.tournament as TournamentType;

  return (
    <>
      <ErrorHandler />
      <Heading level="h1" className="text-emerald-600 mb-5">
        {tournament.name}
      </Heading>

      <section className="flex flex-col gap-5 xl:flex-row lg:gap-10 mb-5 lg:mb-10">
        <div className="w-full xl:max-w-lg flex justify-center">
          {
            !tournament.imageUrl ? (
              <div className={styles.imagePlaceholder}>
                <Trophy size={480} strokeWidth={1} className={styles.imagePlaceholderIcon} />
              </div>
            ) : (
              <Image
                src={tournament.imageUrl}
                width={500}
                height={500}
                alt={tournament.name}
                className="w-full max-w-lg h-auto rounded-lg object-cover"
              />
            )
          }
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col gap-0 lg:flex-row lg:gap-5 mb-5">
            <div className="w-full lg:w-1/2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold">Temporada</TableHead>
                    <TableCell>{tournament.season}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="w-auto md:w-28 font-semibold">País</TableHead>
                    <TableCell>{tournament.country}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">
                      Ciudad{tournament.cities && tournament.cities.length > 0 ? 'es' : ''}
                    </TableHead>
                    <TableCell>
                      {tournament.cities && (tournament.cities.length > 0) && (
                        <p className="text-wrap">
                          {tournament.cities?.join(', ')}
                        </p>
                      )}
                      {!tournament.cities && (
                        <p className={styles.emptyCitiesMessage}>
                          Aún no definidas
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="w-full lg:w-1/2">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHead className="font-semibold w-auto md:w-28">Fase</TableHead>
                    <TableCell>
                      <Badge variant={getStageTranslation(tournament.stage).variant}>
                        {getStageTranslation(tournament.stage).label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">
                      <p className="text-wrap">Fecha Inicial</p>
                    </TableHead>
                    <TableCell>
                      <p className="text-pretty">
                        {formatDate(new Date(tournament.startDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </p>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableHead className="font-semibold">Fecha Final</TableHead>
                    <TableCell>
                      <p className="text-pretty">
                        {formatDate(new Date(tournament.endDate as Date), "d 'de' MMMM 'del' yyyy", { locale: es })}
                      </p>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          <section className={styles.description}>
            <h2 className={styles.teamsSubheading}>Descripción</h2>
            <p>{tournament.description}</p>
          </section>
          <section>
            <h2 className={styles.teamsSubheading}>Categorías</h2>
            <div className="flex flex-wrap gap-2">
              {tournament.categories.map(({ id, name }) => (
                <Badge key={id} variant="outline-info">
                  {name}
                </Badge>
              ))}
            </div>
          </section>
        </div>
      </section>

      <h2 className={styles.teamsSubheading}>
        Equipos{' '}
        <span className={styles.teamsQty}>({tournament.teamsQuantity})</span>
      </h2>

      {(tournament.teams.length > 0) ? (
        <section className={styles.teams}>
          {tournament.teams.map((team) => (
            <section key={team.id} className={styles.teamCard}>
              <Link
                href={
                  ROUTES.PUBLIC_TEAM_SHOW(team.permalink) +
                  `?tournament=${tournament.permalink}`
                }
              >
                {!team.imageUrl ? (
                  <ShieldBan
                    className="text-gray-400"
                    size={200}
                    strokeWidth={1}
                  />
                ) : (
                  <Image
                    src={team.imageUrl}
                    width={200}
                    height={200}
                    className="object-contain"
                    alt={`${team.name} equipo`}
                  />
                )}
              </Link>
              <Link href={
                ROUTES.PUBLIC_TOURNAMENT_SHOW(team.permalink) +
                `?tournament=${tournament.permalink}`
              }>
                {team.name}
              </Link>
            </section>
          ))}
        </section>
      ) : (
        <div className={styles.emptyMessage}>
          <p>¡ El torneo aún no tiene equipos asignados !</p>
        </div>
      )}
    </>
  );
};
