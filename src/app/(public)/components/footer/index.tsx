import { FooterLinks } from "./footer-links";
import { SocialMedia } from "./social-media";
import "./styles.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <section className="links">
        <FooterLinks />
        <SocialMedia />
      </section>
      <p className="copyright">&copy; 2025 Limefut</p>
    </footer>
  );
};

export default Footer;
