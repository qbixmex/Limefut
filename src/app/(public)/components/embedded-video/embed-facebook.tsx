'use client';

import { useEffect, useState, type FC } from 'react';
import Image from 'next/image';
import './embed-facebook.css';

type Props = Readonly<{
  url: string;
  title?: string;
  className: string;
}>;

export const EmbedFacebook: FC<Props> = ({ url, title, className }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const response = await fetch('/api/facebook-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();
        setThumbnailUrl(data.thumbnailUrl || '');
      } catch (error) {
        console.error('Error:', error);
        setThumbnailUrl('');
      } finally {
        setLoading(false);
      }
    };

    fetchThumbnail();
  }, [url]);

  return (
    <div id="facebook" className={className}>
      {
        (loading)
          ? <div className="loading-block" />
          : (!thumbnailUrl) ? <div className="placeholder-block" />
          : (
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
