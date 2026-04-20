import { SoccerField } from '@/shared/components/icons';
import styles from './styles.module.css';

export const EmptyMatches = () => {
  return (
    <div id={styles.wrapper}>
      <SoccerField
        size={300}
        strokeWidth={0.5}
        className={styles.icon}
        ariaLabel="Icono de campo de fútbol"
      />
      <p
        className={styles.message}
        role="alert"
        aria-label="No se encontraron encuentros"
      >No se encontraron encuentros</p>
    </div>
  );
};
