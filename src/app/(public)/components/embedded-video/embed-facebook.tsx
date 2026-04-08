'use client';

import { useEffect, useState, type FC } from 'react';
import Image from 'next/image';
import { fetchThumbnail } from './(actions)/fetch-thumbnail';
import './embed-facebook.css';

type Props = Readonly<{
  url: string;
  title?: string;
  className: string;
}>;

export const EmbedFacebook: FC<Props> = ({ url, title, className }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchThumbnail(url)
      .then(({ thumbnailUrl }) => setThumbnailUrl(thumbnailUrl))
      .catch((error: Error) => {
        setError(error.message);
        setThumbnailUrl('');
      })
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <div id="facebook" className={className}>
      {
        (loading)
          ? <div className="loading-block" role="status" />
          : error?.length > 0 ? (
            <div
              className="placeholder-block"
              role="status"
              aria-label="No se pudo cargar la miniatura del video de Facebook"
            />
          ) : (
            <Image
              width={230}
              height={408}
              className="thumbnail-image"
              src={thumbnailUrl}
              alt={title || 'Facebook thumbnail'}
            />
          )
      }
    </div>
  );
};
