import { Suspense } from 'react';
import { FooterLinks } from './footer-links';
import { SocialMedia } from './social-media';
import { FooterLinksSkeleton } from './footer-links-skeleton';
import { socialMedia } from './data/social-media';
import './styles.css';

export const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <section className="links">
        <Suspense fallback={<FooterLinksSkeleton />}>
          <FooterLinks />
        </Suspense>
        <SocialMedia socialMedia={socialMedia} />
      </section>
      <p className="copyright" aria-label="Derechos reservados">&copy; 2025 Limefut</p>
    </footer>
  );
};

export default Footer;
