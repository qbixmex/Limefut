import type { FC } from 'react';
import styles from './youtube-player.module.css';

type Props = Readonly<{
  url: string;
  title: string;
}>;

export const YoutubePlayer: FC<Props> = ({ url, title }) => {
  const lastSegment = url.split('/').at(-1);
  const videoId = lastSegment?.split('?')[0];

  return (
    <div className={styles.videoResponsive}>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={`${title} video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};
