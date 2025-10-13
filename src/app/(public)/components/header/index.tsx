import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { ThemeSwitcher } from "@/shared/theme/ThemeSwitcher";
import { Logo } from "../logo/Logo";
import styles from "./styles.module.css";
import { SignInOut } from "./sign-in-out";
import { auth } from "@/auth.config";

export const Header = async () => {
  const session = await auth();

  return (
    <header className={styles.header}>
      <Logo />
      <DesktopMenu />
      <div className="flex items-center gap-4 lg:gap-2">
        <MobileMenu />
        <SignInOut session={session} />
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};

export default Header;