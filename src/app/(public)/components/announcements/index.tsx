import Link from 'next/link';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { Newspaper } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { fetchPublicAnnouncementsAction } from '../../(actions)/home/fetchPublicAnnouncements';
import Image from 'next/image';
import styles from './announcements.module.css';

export const Announcements = async () => {
  const { ok, announcements } = await fetchPublicAnnouncementsAction();

  return (
    <section className={styles.announcements}>
      <header>
        <h2 className={styles.heading}>Noticias</h2>
      </header>

      <div className={styles.content}>
        {(!ok || announcements.length === 0) && (
          <div className={styles.emptyContent}>
            <p>Por el momento<br />no hay noticias</p>
            <Newspaper className={styles.icon} />
          </div>
        )}

        {(announcements.length > 0) && (
          <div className={styles.announcements}>
            {announcements.map((announcement) => (
              <article
                key={announcement.id}
                className={styles.announcement}
                aria-label={`Anuncio: ${announcement.title}`}
              >
                <h3 className={styles.subtitle}>{announcement.title}</h3>

                {announcement?.imageUrl && (
                  <figure>
                    <Image
                      width={0}
                      height={0}
                      src={announcement.imageUrl}
                      alt={`${announcement.title} imagen`}
                      className={styles.image}
                    />
                  </figure>
                )}

                <p className={styles.date} role="contentinfo">
                  {formatInTimeZone(announcement.publishedDate, 'America/Mexico_City', "d 'de' MMMM 'del' yyyy", { locale: es })}
                </p>
                <p className={styles.description} role="region">{announcement.description}</p>
                <Link
                  href={ROUTES.PUBLIC_ANNOUNCEMENTS_SHOW(announcement.permalink)}
                  className={styles.moreLink}
                  aria-label={`Ver más sobre el anuncio: ${announcement.title}`}
                >
                  ver más
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
