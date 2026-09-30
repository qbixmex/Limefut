import type { FC } from 'react';
import { CreateStandings } from '../create-standings';
import { TournamentData } from '@/shared/components/tournament-data';
import type {
  TEAM_TYPE,
  TOURNAMENT_TYPE,
} from '@/app/admin/estadisticas/(actions)/fetch-standings.action';
import { fetchStandingsAction } from '../../(actions)/fetch-standings.action';
import { StandingsTable } from '../standings-table';
import { UpdateStandings } from '../update-standings';
import { DeleteStandings } from '../delete-standings';
import styles from './styles.module.css';

type Props = Readonly<{
  tournamentId: string;
  categoryId: string;
}>;

export const StandingsContent: FC<Props> = async ({ tournamentId, categoryId }) => {
  if (!tournamentId && !categoryId) return null;

  const { teams, tournament, standings } = await fetchStandingsAction({
    tournamentId,
    categoryId,
  });

  return (
    <>
      <TournamentData
        tournament={tournament as TOURNAMENT_TYPE}
        teams={teams as TEAM_TYPE[]}
        standings={standings!.length > 0}
        admin
      />

      <section className={styles.standings}>
        {standings!.length > 0 && (
          <>
            <div className={styles.standingsLayout}>
              <h3 className={styles.standingsTitle}>Tabla de posiciones</h3>

              {standings && (
                <div className="flex items-center gap-5">
                  <UpdateStandings
                    tournamentId={tournamentId}
                    categoryId={categoryId}
                  />
                  <DeleteStandings tournamentId={tournamentId} />
                </div>
              )}
            </div>

            {!standings && (
              <div className={styles.emptyStandings}>
                Aún no existen estadísticas para el torneo actual
              </div>
            )}

            {(standings) && <StandingsTable standings={standings} />}
          </>
        )}

        {tournament && (teams.length > 0) && (standings!.length === 0) && (
          <>
            <div className={styles.divider} />
            <div className={styles.bottomEmptyStandings}>
              <p className={styles.emptyDescription}>
                El torneo aún no tiene tabla de posiciones
              </p>
              <CreateStandings teams={teams} />
            </div>
          </>
        )}
      </section>
    </>
  );
};
