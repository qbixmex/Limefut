import { Suspense, type FC, type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Container, Footer, Header } from './components';
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

type Props = Readonly<{ children: ReactNode; }>

const PublicLayout: FC<Props> = ({ children }) => {
  return (
    <Suspense>
      <PublicLayoutContent>
        {children}
      </PublicLayoutContent>
    </Suspense>
  );
};

const PublicLayoutContent: FC<Props> = async ({ children }) => {
  const { globalSettings } = await fetchPublicGlobalSettingsAction();

  return (
    <Container>
      <Header
        siteLogo={globalSettings?.logoUrl ?? null}
        siteName={globalSettings?.siteName ?? null}
      />
      <div className="flex-1 flex flex-col">
        {children}
      </div>
      <Footer
        siteName={globalSettings?.siteName ?? null}
        socialMedia={[
          { facebook: globalSettings?.facebookUrl ?? undefined },
          { twitterX: globalSettings?.twitterXUrl ?? undefined },
          { instagram: globalSettings?.instagramUrl ?? undefined },
          { tikTok: globalSettings?.tiktokUrl ?? undefined },
          { youtube: globalSettings?.youtubeUrl ?? undefined },
        ]}
      />
    </Container>
  );
};

export default PublicLayout;
