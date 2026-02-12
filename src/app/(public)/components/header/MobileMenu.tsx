'use client';

import type { FC } from "react";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { Menu, X as CloseIcon } from 'lucide-react';
import { navigation } from "./navigation-menu/data";
import styles from './styles.mobile-menu.module.css';
import { cn } from "@/lib/utils";

export const MobileMenu: FC = () => {
  const [visible, setVisible] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      setExpandedItems({});
    };
  }, [visible]);

  const toggleSubLinks = (itemId: string) => {
   setExpandedItems((prev) => ({
    ...Object.keys(prev).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>),
    [itemId]: !prev[itemId],
   }));
  };

  return (
    <>
      {!visible && (
        <button onClick={() => setVisible(true)}>
          <Menu className="lg:hidden size-5 text-green-50" />
        </button>
      )}

      {visible && (
        <section className={styles.wrapper}>
          <div className={styles.mobileMenu}>
            {navigation
              .sort((a, b) => a.position - b.position)
              .map((item) => (
                item.url == '#' ? (
                  <div key={item.id} className="w-full text-center">
                    <button
                      className={styles.mobileMenuLink}
                      onClick={() => toggleSubLinks(item.id)}
                    >
                      {item.label}
                    </button>
                    <SubLinks
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
                  >
                    {item.label}
                  </Link>
                )))}
          </div>

          <button
            className={styles.closeButton}
            onClick={() => setVisible(false)}
          >
            <CloseIcon strokeWidth={3} className={styles.closeIcon} />
          </button>
        </section >
      )}
    </>
  );
};

type SubLinksProps = Readonly<{
  links: {
    id: string;
    label: string;
    url: string;
  }[];
  isExpanded: boolean;
  onLinkClick: () => void;
}>;

const SubLinks: FC<SubLinksProps> = ({ links, isExpanded, onLinkClick }) => {
  return (
    <div className={cn("mt-5 space-y-3", !isExpanded && "hidden")}>
      {links.map((link) => (
        <Link
          key={link.id}
          href={link.url}
          className="block text-green-100 text-lg font-semibold active:text-lime-500"
          onClick={onLinkClick}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

export default MobileMenu;
