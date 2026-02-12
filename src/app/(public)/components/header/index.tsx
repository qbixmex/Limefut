import { Suspense } from "react";
import { NavigationMenu } from "./navigation-menu";
import { ThemeSwitcher } from "@/shared/theme/ThemeSwitcher";
import { Logo } from "@/app/(public)/components";
import { AuthSession } from "./AuthSession";
import { Loader2 } from "lucide-react";
import styles from "./styles.module.css";
import MobileMenu from "./MobileMenu";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <NavigationMenu />
      <div className="flex items-center gap-4 lg:gap-2">
        <Suspense fallback={
          <div className="animate-spin">
            <Loader2 />
          </div>
        }>
          <AuthSession />
        </Suspense>
        <MobileMenu />
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};

export default Header;