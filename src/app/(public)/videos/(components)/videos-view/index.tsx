import type { FC } from 'react';
import { fetchPublicVideosAction } from '../../actions/fetch-public-videos.action';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { CalendarDays } from 'lucide-react';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { EmbeddedVideo } from '@/app/(public)/components/embedded-video';
import styles from './styles.module.css';
import Pagination from '@/shared/components/pagination';

const TIME_ZONE = 'America/Mexico_City';

type Props = Readonly<{
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}>;

export const VideosView: FC<Props> = async ({ searchParams }) => {
  const query = (await searchParams).query;
  const currentPage = (await searchParams).page;

  const {
    ok,
    message,
    videos,
    pagination,
  } = await fetchPublicVideosAction({
    page: parseInt(currentPage ?? '1'),
    take: 12,
    searchTerm: query ?? '',
  });

  if (!ok) {
    redirect(`${ROUTES.PUBLIC_VIDEOS}?error=${encodeURIComponent(message)}`);
  }

  return (
    <section>
      <div
        key={`${query ?? 'query'}-${currentPage ?? 'current-page'}`}
        className={styles.videosContainer}
      >
        {videos.length > 0 && videos.map((video) => (
          <div key={video.id} className={styles.videoCard}>
            <Link
              href={ROUTES.PUBLIC_VIDEOS_SHOW(video.permalink)}
              title={`Ver video: ${video.title}`}
            >
              <EmbeddedVideo
                className={styles.thumbnail}
                title={video.title}
                url={video.url}
                platform={video.platform}
              />
            </Link>
            <Link href={video.permalink}>
              <p className={styles.videoHeading}>
                {video.title}
              </p>
            </Link>
            <div className={styles.cardData}>
              <div className={styles.videoDate}>
                <CalendarDays />
                <span>
                  {formatInTimeZone(
                    video.publishedDate,
                    TIME_ZONE,
                    "EEEE dd 'de' LLLL, yyyy",
                    { locale: es },
                  )}
                </span>
              </div>
              <div className={cn(styles.videoPlatform, {
                [styles.youtube]: video.platform === 'youtube',
                [styles.facebook]: video.platform === 'facebook',
                [styles.tiktok]: video.platform === 'tiktok',
                [styles.instagram]: video.platform === 'instagram',
              })}>
                {video.platform === 'youtube' && <FaYoutube size={28} />}
                {video.platform === 'facebook' && <FaFacebook size={24} />}
                {video.platform === 'instagram' && <FaInstagram size={24} />}
                {video.platform === 'tiktok' && <FaTiktok size={24} />}
                <span>
                  {video.platform}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={cn('flex justify-center mt-10', {
        hidden: pagination!.totalPages === 1 || videos.length === 0,
      })}>
        <Pagination totalPages={pagination!.totalPages as number} />
      </div>

      {videos.length === 0 && (
        <div className="border border-sky-600 p-5 rounded">
          <p className="text-sky-500 text-center text-xl font-semibold">
            No hay videos disponibles
          </p>
        </div>
      )}
    </section>
  );
};
