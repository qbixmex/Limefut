import type { FC } from 'react';
import { EmbedYoutube } from './embed-youtube';
import { EmbedFacebook } from './embed-facebook';
import { PLATFORM } from '@/shared/constants/platforms';

type Props = Readonly<{
  url: string;
  title: string;
  platform: string;
  className: string;
}>;

export const EmbeddedVideo: FC<Props> = ({ url, title, platform, className }) => {
  if (platform === '') return null;

  return (
    <>
      {platform === PLATFORM.YOUTUBE && (
        <EmbedYoutube url={url} title={title} className={className} />
      )}
      {platform === PLATFORM.FACEBOOK && (
        <EmbedFacebook url={url} title={title} className={className} />
      )}
    </>
  );
};
