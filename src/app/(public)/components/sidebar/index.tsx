import { Sponsors } from '../sponsors';
import styles from './styles.module.css';

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Sponsors />
    </aside>
  );
};
