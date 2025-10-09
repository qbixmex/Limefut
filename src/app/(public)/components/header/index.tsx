import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { ThemeSwitcher } from "../theme/ThemeSwitcher";
import { Logo } from "../logo/Logo";
import styles from "./styles.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <DesktopMenu />
      <div className="flex items-center gap-3">
        <ThemeSwitcher />
        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;