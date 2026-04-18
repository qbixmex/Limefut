import type { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PiSoccerBall } from 'react-icons/pi';
import './logo.css';

type Props = Readonly<{
  siteName: string | null;
  siteLogo: string | null;
}>;

export const Logo: FC<Props> = ({ siteName, siteLogo }) => {
  return (
    <figure
      id="public-site-logo"
      data-testid="site-logo"
    >
      <Link href="/">
        {
          !siteLogo ? (
            <div className="logo-default">
              <PiSoccerBall
                size={24}
                className="site-logo-icon"
              />
              <span className="site-name-text">{siteName}</span>
            </div>
          ) : (
            <Image
              src={siteLogo}
              width={150}
              height={40}
              alt={`${siteName} logo`}
              className="w-full max-w-[150px]"
              loading="eager"
            />
          )
        }
      </Link>
    </figure>
  );
};

export default Logo;
