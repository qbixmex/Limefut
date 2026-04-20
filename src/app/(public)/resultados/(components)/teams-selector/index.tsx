import { type FC } from 'react';
import { TeamOption } from '../team-option';
import type { TeamType } from '../../(actions)/fetchTeamsByTournamentAction';
import styles from './teams-selector.module.css';

type Props = Readonly<{
  teams: TeamType[];
}>;

export const TeamsSelector: FC<Props> = ({ teams }) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>Seleccione un equipo</p>

      <section className="flex flex-wrap gap-5">
        {teams.map(({ id, name, permalink }) => (
          <TeamOption
            key={id}
            name={name}
            permalink={permalink}
          />
        ))}
      </section>
    </div>
  );
};
