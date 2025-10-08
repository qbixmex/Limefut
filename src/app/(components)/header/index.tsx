import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";
import { links } from "./data";

export const Header = () => {
  return (
    <header className={styles.header}>
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
      <nav className={styles.navigation}>
        {links
          .sort((a, b) => a.position - b.position)
          .map(({ id, url, label }) => (
            <Link
              key={id}
              href={url}
              className={`group ${styles.navigationLink}`}
            >
              {label}
              <div className={`${styles.linkUnderline} group-hover:bg-green-950`}></div>
            </Link>
          ))}
      </nav>
    </header>
  );
};

export default Header;