import { Suspense, type FC } from 'react';
import type { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import { fetchPublicVideoAction, type VideoType } from '../../(actions)/videos/fetchPublicVideo';
import { PLATFORM } from '@/shared/constants/platforms';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { YoutubePlayer } from '../(components)/youtube-player';
import { FacebookPlayer } from '../(components)/facebook-player';
import './styles.css';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Video Limefut',
  robots: 'noindex, nofollow',
};

type Props = Readonly<{
  params: Promise<{
    permalink: string;
  }>
}>;

export const VideoPage: FC<Props> = ({ params }) => {
  return (
    <div className="wrapper dark:bg-gray-600/20!">
      <Suspense>
        <VideoContent params={params} />
      </Suspense>
    </div>
  );
};

export const VideoContent: FC<Props> = async ({ params }) => {
  const permalink = (await params).permalink;

  const response = await fetchPublicVideoAction(permalink);

  if (!response.ok) {
    return redirect(`${ROUTES.HOME}?error=${encodeURIComponent(response.message)}`);
  }

  const video = response.video as VideoType;

  return (
    <div id="video-details">
      <h1 className="heading">{video.title}</h1>

      <div className="video-date">
        <Calendar className="calendar-icon" />
        {
          formatInTimeZone(
            video.publishedDate,
            'America/Mexico_City',
            "d 'de' MMMM 'del' yyyy",
            { locale: es },
          )
        }
      </div>

      <p className="video-description">
        {video.description}
      </p>

      <div className="video-player">
        {video.platform === PLATFORM.YOUTUBE && (
          <YoutubePlayer url={video.url} title={video.title} />
        )}

        {video.platform === PLATFORM.FACEBOOK && (
          <FacebookPlayer url={video.url} title={video.title} />
        )}
      </div>
    </div>
  );
};

export default VideoPage;
