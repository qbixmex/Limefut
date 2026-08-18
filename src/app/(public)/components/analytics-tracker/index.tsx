'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Props = {
  gaId: string;
};

const EXCLUDED_PREFIXES = ['/admin'];
const EXCLUDED_PATHS = new Set(['/login', '/register']);

export const AnalyticsTracker: React.FC<Props> = ({ gaId }) => {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === pathname) {
      return;
    }
    previousPath.current = pathname;

    if (
      EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix)) ||
      EXCLUDED_PATHS.has(pathname)
    ) {
      return;
    }

    const args = [
      'event',
      'page_view',
      {
        page_path: pathname ?? window.location.pathname,
        page_location: window.location.href,
        page_title: document.title,
      },
    ];

    if (typeof window.gtag === 'function') {
      window.gtag(...args);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    }
  }, [pathname]);

  return (
    <>
      <Script
        id="_next-ga-init"
        dangerouslySetInnerHTML={{
          __html: `
            window['dataLayer'] = window['dataLayer'] || [];
            function gtag(){window['dataLayer'].push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', { 'send_page_view': false });
          `,
        }}
      />
      <Script
        id="_next-ga"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
    </>
  );
};
