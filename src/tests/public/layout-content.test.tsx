import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { PublicLayoutContent } from '@/app/(public)/layout-content';
import type { GlobalSettings } from '@/generated/prisma/client';
import { fetchPublicGlobalSettingsAction } from '@/app/admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction';

vi.mock('@/app/admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction', () => ({
  fetchPublicGlobalSettingsAction: vi.fn(),
}));

const mockGlobalSettings = (
  overrides: Partial<GlobalSettings> = {},
): GlobalSettings => ({
  id: 1,
  maintenanceMode: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
} as GlobalSettings);

vi.mock('@/app/(public)/components', () => ({
  Container: ({ children }: { children: ReactNode }) => <>{children}</>,
  Header: () => null,
  Footer: () => null,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('next/script', () => ({
  default: ({
    id,
    src,
    dangerouslySetInnerHTML,
  }: {
    id?: string;
    src?: string;
    dangerouslySetInnerHTML?: { __html: string };
  }) => (
    <div
      id={id}
      data-testid={id}
      role="none"
      data-src={src}
      data-inline={dangerouslySetInnerHTML?.__html}
    />
  ),
}));

describe('Tests on <PublicLayoutContent /> Google Analytics', () => {
  test('Should render Google Analytics when googleAnalyticsId is set', async () => {
    vi.mocked(fetchPublicGlobalSettingsAction).mockResolvedValue({
      ok: true,
      message: 'ok',
      globalSettings: mockGlobalSettings({ googleAnalyticsId: 'G-TEST123' }),
    });

    const ServerComponent = await PublicLayoutContent({ children: <div /> });

    render(ServerComponent);

    const initScript = await screen.findByTestId('_next-ga-init');
    const gaScript = await screen.findByTestId('_next-ga');

    expect(initScript).toHaveAttribute(
      'data-inline',
      expect.stringContaining("gtag('config', 'G-TEST123'"),
    );
    expect(gaScript).toHaveAttribute(
      'data-src',
      'https://www.googletagmanager.com/gtag/js?id=G-TEST123',
    );
  });

  test('Should not render Google Analytics when googleAnalyticsId is missing', async () => {
    vi.mocked(fetchPublicGlobalSettingsAction).mockResolvedValue({
      ok: true,
      message: 'ok',
      globalSettings: mockGlobalSettings({ googleAnalyticsId: null }),
    });

    const ServerComponent = await PublicLayoutContent({ children: <div /> });

    render(ServerComponent);

    await expect(screen.findByTestId('_next-ga')).rejects.toThrow();
    expect(screen.queryByTestId('_next-ga')).not.toBeInTheDocument();
  });
});
