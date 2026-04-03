import Link from 'next/link';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Newspaper } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import './announcements.css';
import { fetchPublicAnnouncementsAction } from '../../(actions)/home/fetchPublicAnnouncements';

export const Announcements = async () => {
  const { ok, announcements } = await fetchPublicAnnouncementsAction();

  return (
    <section id="announcements">
      <header>
        <h2 className="heading">Noticias</h2>
      </header>

      <div className="content">
        {(!ok || announcements.length === 0) && (
          <div className="empty-content">
            <p>No hay noticias que mostrar por el momento</p>
            <Newspaper className="icon" />
          </div>
        )}

        {(announcements.length > 0) && (
          <div className="announcements">
            {announcements.map(({ id, permalink, title, description, publishedDate }) => (
              <div key={id} className="announcement">
                <h3 className="subtitle">{title}</h3>
                <p className="date">{formatInTimeZone(publishedDate, 'America/Mexico_City', "d 'de' MMMM 'del' yyyy", { locale: es })}</p>
                <p className="description">{description}</p>
                <Link
                  href={ROUTES.PUBLIC_ANNOUNCEMENTS_SHOW(permalink)}
                  className="more"
                >
                  Ver más
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
