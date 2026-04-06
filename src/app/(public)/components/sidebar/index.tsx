import { Announcements } from '../announcements';
import { Sponsors } from '../sponsors';
import { Videos } from '../videos';
import './sidebar.css';

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <Sponsors />

      <Announcements />

      <Videos />
    </div>
  );
};
