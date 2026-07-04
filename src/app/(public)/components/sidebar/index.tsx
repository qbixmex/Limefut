import { Announcements } from '../announcements';
import { Sponsors } from '../sponsors';
import { Videos } from '../videos';
import styles from './sidebar.module.css';

export const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Sponsors />
      <Announcements />
      <Videos />
    </div>
  );
};
