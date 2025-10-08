import { FaFacebookF } from "react-icons/fa6";
import styles from "./styles.module.css";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialMedia}>
        <a href="https://www.facebook.com/profile.php?id=100063787951166">
          <div className={styles.facebook}>
            <FaFacebookF className={styles.facebookIcon} />
          </div>
        </a>
      </div>
      <p className={styles.copyright}>&copy; 2025 Limefut</p>
    </footer>
  );
};

export default Footer;
