import type { FC, ReactNode } from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PublicLayoutContent } from './layout-content';
import { fetchPublicGlobalSettingsAction } from '../admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction';
import '@/app/globals.css';

export const generateMetadata = async (): Promise<Metadata> => {
  const { globalSettings } = await fetchPublicGlobalSettingsAction();

  const siteName = globalSettings?.siteName ?? 'Nombre de la liga';
  const seoTitle = globalSettings?.seoTitle ?? 'Liga de fútbol';
  const seoDescription = globalSettings?.seoDescription;
  const ogImageUrl = globalSettings?.ogImageUrl;

  return {
    title: {
      default: seoTitle,
      template: `%s - ${siteName}`,
    },
    description: seoDescription,
    icons: {
      icon: [
        { url: globalSettings?.faviconUrl ?? '/favicon.png', type: 'image/png' },
      ],
    },
    openGraph: {
      type: 'website',
      images: [
        {
          url: ogImageUrl ?? '/favicon.png',
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: globalSettings?.seoTitle ?? 'Liga de fútbol',
      description: seoDescription,
      images: [
        {
          url: ogImageUrl ?? '/favicon.png',
          alt: siteName,
        },
      ],
    },
  };
};

type Props = Readonly<{ children: ReactNode; }>;

const PublicLayout: FC<Props> = ({ children }) => {
  return (
    <Suspense>
      <PublicLayoutContent>
        {children}
      </PublicLayoutContent>
    </Suspense>
  );
};

export default PublicLayout;
