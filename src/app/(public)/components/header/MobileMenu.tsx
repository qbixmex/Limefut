'use client';

import { useEffect, useState } from "react";
import Link from 'next/link';
import { Menu, X as CloseIcon } from 'lucide-react';
import { links } from "./data";
import styles from './styles.mobile-menu.module.css';

export const MobileMenu = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible]);

  return (
    <div className={styles.container}>
      {!visible && (
        <button onClick={() => setVisible(true)}>
          <Menu className="text-green-50" />
        </button>
      )}

      {visible && (
        <section className={styles.wrapper}>
          <div className={styles.mobileMenu}>
            {links
              .sort((a, b) => a.position - b.position)
              .map(({ id, url, label }) => (
                <Link
                  key={id}
                  href={url}
                  className={styles.mobileMenuLink}
                  onClick={() => setVisible(false)}
                >
                  {label}
                </Link>
              ))}
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setVisible(false)}
          >
            <CloseIcon strokeWidth={3} className={styles.closeIcon} />
          </button>
        </section>
      )}
    </div>
  );
};

export default MobileMenu;
