import Link from "next/link";
import { links } from "./data";
import styles from "./styles.desktop-menu.module.css";
import { cn } from "@/lib/utils";

export const DesktopMenu = () => {
  return (
    <nav className={styles.navigation}>
      {links
        .sort((a, b) => a.position - b.position)
        .map(({ id, url, label }) => (
          <Link
            key={id}
            href={url}
            className={cn('group', styles.navigationLink)}
          >
            {label}
            <div className={cn(styles.linkUnderline, 'group-hover:bg-green-950')}></div>
          </Link>
        ))}
    </nav>
  );
};

export default DesktopMenu;