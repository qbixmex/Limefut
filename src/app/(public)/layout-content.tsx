import type { FC, ReactNode } from 'react';
import { Container, Footer, Header } from './components';
import { AnalyticsTracker } from './components/analytics-tracker';
import { fetchPublicGlobalSettingsAction } from '../admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction';

type Props = Readonly<{ children: ReactNode; }>;

export const PublicLayoutContent: FC<Props> = async ({ children }) => {
  const { globalSettings } = await fetchPublicGlobalSettingsAction();

  return (
    <>
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
      {
        globalSettings?.googleAnalyticsId && (
          <AnalyticsTracker gaId={globalSettings.googleAnalyticsId} />
        )
      }
    </>
  );
};
