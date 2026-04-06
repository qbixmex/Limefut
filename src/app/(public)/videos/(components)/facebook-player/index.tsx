'use client';

import { useEffect, useState, type FC } from 'react';
import styles from './facebook-player.module.css';

type Props = Readonly<{
  url: string;
  title: string;
}>;

export const FacebookPlayer: FC<Props> = ({ url, title }) => {
  const BASE_URL = 'https://www.facebook.com/plugins/video.php';
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolve = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/facebook-resolve-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error('Failed to resolve URL');
        }

        const { realUrl } = await response.json();
        setResolvedUrl(realUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    resolve();
  }, [url]);

  if (error) {
    return (
      <div className={styles.error}>
        Error al cargar el video video
      </div>
    );
  }

  if (loading) {
    return <div className={styles.loadingVideo} />;
  }

  const src = `${BASE_URL}?height=476&href=${encodeURIComponent(resolvedUrl as string)}&show_text=false&width=267&t=0`;

  return (
    <div className={styles.videoResponsive}>
      <iframe
        src={src}
        title={title}
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      />
    </div>
  );
};
