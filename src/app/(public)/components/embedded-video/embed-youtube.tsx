import type { FC } from 'react';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  url: string;
  title?: string;
  className: string;
}>;

export const EmbedYoutube: FC<Props> = ({ url, title, className }) => {
  const lastPart = url.split('/').at(-1) || '';
  const videoId = lastPart.split('?').at(0);

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <img
      className={cn('block w-[230px] h-auto', className)}
      src={thumbnailUrl}
      alt={title || 'Video thumbnail'}
    />
  );
};
