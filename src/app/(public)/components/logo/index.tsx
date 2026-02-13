import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

export const Logo = () => {
  return (
    <div className={styles.logo}>
      <Link href="/">
        <Image
          src="/limefut-logo.png"
          width={150}
          height={40}
          alt="Limefut Logo"
          className="w-full max-w-[150px]"
        />
      </Link>
    </div>
  );
};

export default Logo;