import { FaFacebookF } from "react-icons/fa6";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.socialMedia}>
        <a
          href="https://www.facebook.com/profile.php?id=100063787951166"
          className="group"
          target="_blank"
        >
          <div className={cn([
            styles.facebook,
            'border-gray-600',
            'dark:border-gray-300',
            'group-hover:border-blue-500!',
            'group-hover:bg-blue-500'
          ])}>
            <FaFacebookF className={cn([
              styles.facebookIcon,
              'dark:text-gray-200!',
              'group-hover:text-neutral-50!'
            ])} />
          </div>
        </a>
      </div>
      <p className={styles.copyright}>&copy; 2025 Limefut</p>
    </footer>
  );
};

export default Footer;
