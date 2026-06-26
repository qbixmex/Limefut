import Link from 'next/link';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { BsFilm } from 'react-icons/bs';
import { fetchPublicVideosAction } from '../../(actions)/home/fetchPublicVideosAction';
import { EmbeddedVideo } from '../embedded-video';
import styles from './videos.module.css';

export const Videos = async () => {
  const { ok, videos } = await fetchPublicVideosAction();

  return (
    <section className={styles.videosContainer}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Videos</h2>
        <Link href="/videos" className={styles.videosLink}>ver todos</Link>
      </header>

      <div className={styles.content}>
        {(!ok || videos.length === 0) && (
          <div className={styles.emptyContent}>
            <p role="region">
              No hay videos que mostrar<br />por el momento.
            </p>
            <BsFilm className={styles.icon} />
          </div>
        )}

        {(videos.length > 0) && (
          <div className={styles.videos}>
            {videos.map((video) => (
              <article
                key={video.id}
                className={styles.video}
                aria-label={`Video: ${video.title}`}
              >
                <h3 className={styles.videoSubtitle}>{video.title}</h3>
                <Link
                  href={ROUTES.PUBLIC_VIDEOS_SHOW(video.permalink)}
                  title={`Ver video: ${video.title}`}
                >
                  <EmbeddedVideo
                    className={styles.videoThumbnail}
                    title={video.title}
                    url={video.url}
                    platform={video.platform}
                  />
                </Link>
                <p className={styles.videoDate} role="contentinfo">
                  {
                    formatInTimeZone(
                      video.publishedDate,
                      'America/Mexico_City',
                      "d 'de' MMMM 'del' yyyy",
                      { locale: es },
                    )
                  }
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
