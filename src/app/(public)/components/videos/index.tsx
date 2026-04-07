import Link from 'next/link';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { BsFilm } from 'react-icons/bs';
import { fetchPublicVideosAction } from '../../(actions)/home/fetchPublicVideosAction';
import { EmbeddedVideo } from '../embedded-video';
import './videos.css';

export const Videos = async () => {
  const { ok, videos } = await fetchPublicVideosAction();

  return (
    <section id="videos">
      <header>
        <h2 className="heading">Videos</h2>
      </header>

      <div className="content">
        {(!ok || videos.length === 0) && (
          <div className="empty-content">
            <p role="region">No hay videos que mostrar por el momento</p>
            <BsFilm className="icon" />
          </div>
        )}

        {(videos.length > 0) && (
          <div className="videos">
            {videos.map((video) => (
              <article
                key={video.id}
                className="video"
                aria-label={`Video: ${video.title}`}
              >
                <h3 className="subtitle">{video.title}</h3>
                <Link
                  href={ROUTES.PUBLIC_VIDEOS_SHOW(video.permalink)}
                  title={`Ver video: ${video.title}`}
                >
                  <EmbeddedVideo
                    className="thumbnail"
                    title={video.title}
                    url={video.url}
                    platform={video.platform}
                  />
                </Link>
                <p className="date" role="contentinfo">
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
