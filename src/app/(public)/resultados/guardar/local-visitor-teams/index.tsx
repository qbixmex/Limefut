'use client';

import type { FC } from 'react';
import { LocalTeamSelect } from './local-team.select';
import { VisitorTeamSelect } from './visitor-team.select';
import { useSearchParams } from 'next/navigation';
import styles from '../styles.module.css';

type Props = Readonly<{
  teams: {
    id: string;
    name: string;
    permalink: string;
  }[];
}>;

export const LocalVisitorTeams: FC<Props> = ({ teams }) => {
  const searchParams = useSearchParams();
  const disabled = !searchParams.has('category') || teams.length === 0;

  return (
    <section className={styles.fieldsGroup}>
      <LocalTeamSelect teams={teams} disabled={disabled} />
      <VisitorTeamSelect teams={teams} disabled={disabled} />
    </section>
  );
};
