import { type FC, Suspense } from 'react';
import { FooterLinks } from './footer-links';
import { SocialMedia } from './social-media';
import { FooterLinksSkeleton } from './footer-links-skeleton';
import { socialMediaData } from './data/social-media';
import type { SOCIAL_PLATFORM } from '@/shared/enums/social-platform';
import './styles.css';

type Props = Readonly<{
  siteName?: string | null;
  socialMedia?: Partial<Record<SOCIAL_PLATFORM, string>>[];
}>;

export const Footer: FC<Props> = ({ siteName = '', socialMedia = [] }) => {
  const updatedSocialMedia = socialMediaData.map((social) => {
    const socialItem = socialMedia.find((item) => item[social.platform]);

    return {
      ...social,
      url: socialItem?.[social.platform] || social.url,
    };
  });

  return (
    <footer id="footer" className="footer">
      <section className="links">
        <Suspense fallback={<FooterLinksSkeleton />}>
          <FooterLinks />
        </Suspense>
        <SocialMedia socialMedia={updatedSocialMedia} />
      </section>
      <p className="copyright" aria-label="Derechos reservados">&copy; 2025 {siteName}</p>
    </footer>
  );
};

export default Footer;
