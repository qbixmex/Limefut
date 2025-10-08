import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.css";

export const Logo = () => {
  return (
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
  );
};

export default Logo;