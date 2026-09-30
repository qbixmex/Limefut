import { EditBannerPageView } from '@/app/admin/banners/editar/[id]/edit-banner-view';
import { render, screen } from '@testing-library/react';
import { heroBannerMock } from '../mocks/hero-banner.mock';
import { fetchHeroBannerAction } from '@/app/admin/banners/(actions)';
import { ROUTES } from '@/shared/constants/routes';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/banners/(actions)', () => ({
  fetchHeroBannerAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/banners/editar/[id]/edit-banner-form', () => ({
  EditBannerForm: () => <div data-testid="edit-banner-form" />,
}));

describe('Tests on EditBannerPageView', () => {
  const defaultResponse = {
    ok: true,
    message: '¡ Banner obtenido correctamente 👍 !',
    heroBanner: heroBannerMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchHeroBannerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await EditBannerPageView({
      params: Promise.resolve({ id: heroBannerMock.id }),
    });
    return render(ServerComponent);
  };

  test('Should render title', async () => {
    await renderComponent();
    const title = screen.getByRole('heading', { name: /título/i });
    expect(title).toHaveTextContent(/editar banner/i);
  });

  test('Should render <EditBannerForm /> component', async () => {
    await renderComponent();

    const editBannerForm = screen.getByTestId('edit-banner-form');

    expect(editBannerForm).toBeInTheDocument();
    expect(fetchHeroBannerAction).toHaveBeenCalledWith(heroBannerMock.id);
  });

  test('Should redirect when fetch fails', async () => {
    const testMessage = 'Banner no encontrado';
    vi.mocked(fetchHeroBannerAction).mockResolvedValue({
      ok: false,
      message: testMessage,
      heroBanner: null,
    });

    await EditBannerPageView({
      params: Promise.resolve({ id: heroBannerMock.id }),
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_BANNERS}?error=${encodeURIComponent(testMessage)}`,
    );
  });
});
