import { SoccerField } from '@/shared/components/icons';
import styles from './styles.module.css';

export const EmptyMatches = () => {
  return (
    <div id={styles.wrapper}>
      <SoccerField size={300} strokeWidth={0.5} className={styles.icon} />
      <p className={styles.message}>No se encontraron encuentros</p>
    </div>
  );
};
