'use client';

import { navigation } from './data';
import Link from 'next/link';
import "./navigation-menu.css";

export const NavigationMenu: React.FC = () => {
  return (
    <nav className="navigation-menu">
      <div className="navigation-content">
        {navigation.map((item) => (
          <div key={item.id} className="group navigation-items">
            {(item.url == '#') ? (
              <>
                <span>{item.label}</span>
                <div className="navigation-links-wrapper">
                  <div className="navigation-links">
                    {item.links.map((link) => (
                      <Link key={link.id} href={link.url} className="navigation-link">
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
