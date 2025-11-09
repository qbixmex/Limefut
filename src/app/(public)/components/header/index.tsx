import { Suspense } from "react";
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { ThemeSwitcher } from "@/shared/theme/ThemeSwitcher";
import { Logo } from "@/app/(public)/components";
import styles from "./styles.module.css";
import { AuthSession } from "./AuthSession";
import { Loader2 } from "lucide-react";

export const Header = () => {
  return (
    <header className={styles.header}>
      <Logo />
      <DesktopMenu />
      <div className="flex items-center gap-4 lg:gap-2">
        <MobileMenu />
        <Suspense fallback={
          <div className="animate-spin">
            <Loader2 />
          </div>
        }>
          <AuthSession />
        </Suspense>
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};

export default Header;