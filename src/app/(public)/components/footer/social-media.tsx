import type { FC } from 'react';
import { cn } from '~/src/lib/utils';
import type { Social } from './data/social-media';
import './styles.css';

type Props = Readonly<{
  socialMedia: Social[];
}>;

export const SocialMedia: FC<Props> = ({ socialMedia }) => {
  return (
    <nav
      className="social-media"
      aria-label="Enlaces del redes sociales"
    >
      {
        (socialMedia.length > 0) ? socialMedia
          .filter((item) => item.url !== '#')
          .map((item) => (
            <div key={item.platform} className="social-link">
              <a href={item.url} target="_blank">
                <item.icon
                  className={cn(['social-icon', item.css])}
                  role="icon"
                  aria-label="Social media icon"
                />
              </a>
            </div>
          )) : (
          <p role="alert">Aún no hay redes sociales disponibles.</p>
        )
      }
    </nav>
  );
};

export default SocialMedia;
