'use client';

import { type FC } from 'react';
import { Logo } from '../logo';
import { NavigationMenu } from './navigation-menu';
import { AuthSession } from './AuthSession';
import { MobileMenu } from './MobileMenu';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import styles from './styles.module.css';
import type { SessionUI } from '@/shared/types';

type Props = Readonly<{ session: SessionUI }>;

export const HeaderClient: FC<Props> = ({ session }) => {
  return (
    <header
      role="banner"
      aria-label="Cabecera principal"
      className={styles.header}
    >
      <Logo />
      <NavigationMenu />
      <div className="flex items-center gap-4 lg:gap-2">
        <AuthSession session={session} />
        <MobileMenu />
        <ThemeSwitcher className="text-green-50" />
      </div>
    </header>
  );
};
