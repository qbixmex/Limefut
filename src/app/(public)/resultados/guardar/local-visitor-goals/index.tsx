import type { FC } from 'react';
import { LocalGoalsField } from './local-goals-field';
import { VisitorGoalsField } from './visitor-goals-field';
import styles from '../styles.module.css';

export const LocalVisitorGoals: FC = () => {
  return (
    <section className={styles.goalsGroup}>
      <LocalGoalsField />
      <VisitorGoalsField />
    </section>
  );
};
