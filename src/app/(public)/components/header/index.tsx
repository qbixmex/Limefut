import { Suspense } from 'react';
import { Logo } from '../logo';
import { NavigationMenu } from './navigation-menu';
import { AuthSession } from './AuthSession';
import { MobileMenu } from './mobile-menu';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import { navigation } from './navigation-menu/data';
import styles from './styles.module.css';

export const Header = () => {
  return (
    <header
      role="banner"
      aria-label="Cabecera principal"
      className={styles.header}
    >
      <Logo />
      <NavigationMenu navigation={navigation} />
      <div className="flex items-center gap-4 lg:gap-2">
        <Suspense>
          <AuthSession />
        </Suspense>
        <MobileMenu navigation={navigation} />
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};

export default Header;
