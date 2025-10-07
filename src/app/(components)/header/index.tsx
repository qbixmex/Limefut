import Image from "next/image";
import { FaFacebookF } from "react-icons/fa6";
import styles from "./styles.module.css";
import Link from "next/link";

export const Header = () => {
  return (
    <header>
      <section className={styles.header}>
        <div className={styles.logo}>
          <Link href="/">
            <Image
              src="/limefut-logo.png"
              width={256}
              height={256}
              alt="Limefut Logo"
              className="w-full max-w-[256px]"
            />
          </Link>
        </div>
        <div className={styles.socialMedia}>
          <p className={styles.hashtag}><b>#</b>ligamenordefutbol</p>
          <a href="https://www.facebook.com/profile.php?id=100063787951166">
            <div className={styles.facebook}>
              <FaFacebookF className={styles.facebookIcon} />
            </div>
          </a>
        </div>
      </section>
      <nav className={styles.navigation}>
        <Link href="#">Equipos</Link>
        <Link href="#">Roles y Estadísticas</Link>
        <Link href="#">Información</Link>
        <Link href="#">Más</Link>
      </nav>
    </header>
  );
};

export default Header;