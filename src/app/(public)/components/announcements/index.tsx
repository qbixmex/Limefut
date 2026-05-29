import Link from 'next/link';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Newspaper } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { fetchPublicAnnouncementsAction } from '../../(actions)/home/fetchPublicAnnouncements';
import Image from 'next/image';
import './announcements.css';

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
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className="announcement"
                aria-label={`Anuncio: ${announcement.title}`}
              >
                <h3 className="subtitle">{announcement.title}</h3>

                {announcement?.imageUrl && (
                  <figure>
                    <Image
                      width={250}
                      height={250}
                      src={announcement.imageUrl}
                      alt={`${announcement.title} imagen`}
                      className="w-full max-w-[250px] my-5 rounded-md"
                    />
                  </figure>
                )}

                <p className="date" role="contentinfo">
                  {formatInTimeZone(announcement.publishedDate, 'America/Mexico_City', "d 'de' MMMM 'del' yyyy", { locale: es })}
                </p>
                <p className="description" role="region">{announcement.description}</p>
                <Link
                  href={ROUTES.PUBLIC_ANNOUNCEMENTS_SHOW(announcement.permalink)}
                  className="more"
                  aria-label={`Ver más sobre el anuncio: ${announcement.title}`}
                >
                  Ver más
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
