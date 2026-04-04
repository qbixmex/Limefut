import { Announcements } from '../announcements';
import { Sponsors } from '../sponsors';
import './sidebar.css';

export const Sidebar = () => {
  return (
    <aside className="sidebar">
      <Sponsors />
      <Announcements />
    </aside>
  );
};
