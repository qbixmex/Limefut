import { render, screen } from '@testing-library/react';
import { LoginContent } from '@/app/auth/login/page';
import type { GlobalSettings } from '@/generated/prisma/client';

const mockGetSession = vi.hoisted(() => vi.fn());
const mockFetchGlobalSettings = vi.hoisted(() => vi.fn());
const mockRedirect = vi.fn();

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
}));

vi.mock('@/app/admin/ajustes-globales/(actions)/fetchPublicGlobalSettingsAction', () => ({
  fetchPublicGlobalSettingsAction: mockFetchGlobalSettings,
}));

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

vi.mock('@/app/auth/login/components/login-form', () => ({
  LoginForm: () => <div data-testid="login-form" />,
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

describe('Tests on <LoginContent /> page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue(null);
  });

  test('Should render correctly', async () => {
    mockFetchGlobalSettings.mockResolvedValue({
      ok: true,
      message: 'ok',
      globalSettings: mockGlobalSettings(),
    });

    const serverComponent = await LoginContent();
    render(serverComponent);

    expect(screen.getByText(/accede/i)).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  test('Should show the logo when logoUrl exists in globalSettings', async () => {
    mockFetchGlobalSettings.mockResolvedValue({
      ok: true,
      message: 'ok',
      globalSettings: mockGlobalSettings({
        logoUrl: 'https://res.cloudinary.com/custom/image/upload/v1/logo.png',
        siteName: 'Limefut',
      }),
    });

    const serverComponent = await LoginContent();
    render(serverComponent);

    const logo = screen.getByRole('img', { name: /logotipo de limefut/i });
    expect(logo).toBeInTheDocument();
    expect(screen.getByTitle(/inicio/i)).toBeInTheDocument();
  });

  test('Should not show the logo when logoUrl is missing', async () => {
    mockFetchGlobalSettings.mockResolvedValue({
      ok: true,
      message: 'ok',
      globalSettings: mockGlobalSettings({ logoUrl: null }),
    });

    const serverComponent = await LoginContent();
    render(serverComponent);

    expect(screen.getByText(/accede/i)).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
