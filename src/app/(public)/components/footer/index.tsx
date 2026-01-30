import { Suspense } from "react";
import { FooterLinks } from "./footer-links";
import { SocialMedia } from "./social-media";
import { FooterLinksSkeleton } from "./footer-links-skeleton";
import "./styles.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="links">
        <Suspense fallback={<FooterLinksSkeleton />}>
          <FooterLinks />
        </Suspense>
        <SocialMedia />
      </section>
      <p className="copyright">&copy; 2025 Limefut</p>
    </footer>
  );
};

export default Footer;
