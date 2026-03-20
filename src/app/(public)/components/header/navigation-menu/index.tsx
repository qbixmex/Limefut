'use client';

import type { FC } from 'react';
import Link from 'next/link';
import type { Navigation } from './data';
import './navigation-menu.css';

type Props = Readonly<{ navigation: Navigation[] }>;

export const NavigationMenu: FC<Props> = ({ navigation }) => {
  return (
    <nav className="navigation-menu" role="menu" aria-label="Menu principal">
      <div className="navigation-content">
        {navigation.map((item) => (
          <div
            key={item.id} className="group navigation-items"
            role="menuitem"
            aria-haspopup={item.links.length > 0 ? 'true' : 'false'}
            aria-expanded="false"
          >
            {(item.url === '#') ? (
              <>
                <span role="button" aria-haspopup="true" aria-expanded="false">
                  {item.label}
                </span>
                <div className="navigation-links-wrapper" role="menu" aria-label={`${item.label} submenu`}>
                  <div className="navigation-links">
                    {item.links.map((link) => (
                      <Link
                        key={link.id}
                        href={link.url}
                        className="navigation-link"
                        role="menuitem"
                        aria-label={link.label}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link href={item.url}>{item.label}</Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};
