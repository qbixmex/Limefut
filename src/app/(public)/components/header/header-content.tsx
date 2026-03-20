import { type FC } from 'react';
import { Logo } from '../logo';
import { NavigationMenu } from './navigation-menu';
import { AuthSession } from './AuthSession';
import { MobileMenu } from './mobile-menu';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import type { SessionUI } from '@/shared/types';
import { navigation } from './navigation-menu/data';
import styles from './styles.module.css';

type Props = Readonly<{ session: SessionUI }>;

export const HeaderContent: FC<Props> = ({ session }) => {
  return (
    <header
      role="banner"
      aria-label="Cabecera principal"
      className={styles.header}
    >
      <Logo />
      <NavigationMenu navigation={navigation} />
      <div className="flex items-center gap-4 lg:gap-2">
        <AuthSession session={session} />
        <MobileMenu navigation={navigation} />
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};
