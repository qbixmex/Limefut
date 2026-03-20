'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { Menu, X as CloseIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileMenu } from './use-mobile-menu';
import styles from './styles.mobile-menu.module.css';
import type { Navigation } from '../navigation-menu/data';

type Props = Readonly<{ navigation: Navigation[] }>;

export const MobileMenu: FC<Props> = ({ navigation }) => {
  const {
    visible,
    setVisible,
    expandedItems,
    toggleSubLinks,
  } = useMobileMenu();

  return (
    <>
      {!visible && (
        <button
          onClick={() => setVisible(true)}
          role="button"
          aria-label="Abrir menú móvil"
          data-testid="open-mobile-menu"
        >
          <Menu className="lg:hidden size-5 text-green-50" />
        </button>
      )}

      {visible && (
        <section className={styles.wrapper}>
          <nav
            className={styles.mobileMenu}
            role="navigation"
            aria-label="Menú de navegación móvil"
          >
            {navigation
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                item.url === '#' ? (
                  <div key={item.id} className="w-full text-center">
                    <button
                      className={styles.mobileMenuLink}
                      onClick={() => toggleSubLinks(item.id)}
                      role="button"
                      aria-label={`Mostrar enlaces secundarios para ${item.label}`}
                      aria-expanded={expandedItems[item.id] || false}
                      aria-controls={`sub-links-${item.id}`}
                      data-testid={`menu-item-${item.id}`}
                    >
                      {item.label}
                    </button>
                    <SubLinks
                      itemId={item.id}
                      links={item.links}
                      isExpanded={expandedItems[item.id] || false}
                      onLinkClick={() => setVisible(false)}
                    />
                  </div>
                ) : (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={styles.mobileMenuLink}
                    onClick={() => setVisible(false)}
                    role="link"
                    aria-label={`Navegar a ${item.label}`}
                  >
                    {item.label}
                  </Link>
                )))}
          </nav>

          <button
            className={styles.closeButton}
            onClick={() => setVisible(false)}
            role="button"
            aria-label="Cerrar menú móvil"
          >
            <CloseIcon strokeWidth={3} className={styles.closeIcon} />
          </button>
        </section >
      )}
    </>
  );
};

type SubLinksProps = Readonly<{
  itemId: string;
  links: {
    id: string;
    label: string;
    url: string;
  }[];
  isExpanded: boolean;
  onLinkClick: () => void;
}>;

const SubLinks: FC<SubLinksProps> = ({ itemId, links, isExpanded, onLinkClick }) => {
  return (
    <div
      className={cn('mt-5 space-y-3', !isExpanded && 'hidden')}
      data-testid={`sub-links-${itemId}`}
    >
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          className="block text-green-100 text-lg font-semibold active:text-lime-500"
          onClick={onLinkClick}
          role="link"
          aria-label={`Navegar a ${link.label}`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default MobileMenu;
