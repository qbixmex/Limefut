import { BannerView } from '@/app/admin/banners/[id]/banner-view';
import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { heroBannerMock } from '../mocks/hero-banner.mock';
import { fetchHeroBannerAction } from '@/app/admin/banners/(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/banners/(actions)', () => ({
  fetchHeroBannerAction: vi.fn(),
  updateHeroBannerStateAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/shared/components/banner-image', () => ({
  BannerImage: (props: { showData: boolean; dataAlignment: string; position: number }) => (
    <div
      data-testid="banner-image"
      data-show-data={String(props.showData)}
      data-alignment={props.dataAlignment}
      data-position={String(props.position)}
    />
  ),
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <div data-testid="active-switch" />,
}));

vi.mock('@/app/admin/banners/(components)/banner-alignment', () => ({
  BannerAlignment: () => <div data-testid="banner-alignment" />,
}));

vi.mock('@/app/admin/banners/(components)/show-data-switch', () => ({
  ShowDataSwitch: () => <div data-testid="show-data-switch" />,
}));

vi.mock('@/app/admin/banners/(components)/edit-banner', () => ({
  EditBanner: () => <div data-testid="edit-banner" />,
}));

describe('Tests on BannerView', () => {
  const defaultResponse = {
    ok: true,
    message: 'Banner obtenido correctamente',
    heroBanner: heroBannerMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchHeroBannerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await BannerView({
      params: Promise.resolve({ id: heroBannerMock.id }),
    });
    return render(ServerComponent, { wrapper: TooltipProvider });
  };

  test('Should render the banner image with its settings', async () => {
    await renderComponent();

    const bannerImage = screen.getByTestId('banner-image');

    expect(bannerImage).toHaveAttribute('data-show-data', String(heroBannerMock.showData));
    expect(bannerImage).toHaveAttribute('data-alignment', heroBannerMock.dataAlignment);
    expect(bannerImage).toHaveAttribute('data-position', String(heroBannerMock.position));
  });

  test('Should render the settings tables', async () => {
    await renderComponent();

    const bannerAdjustments = screen.getByRole('table', {
      name: /ajustes del banner/i,
    });
    const bannerInformation = screen.getByRole('table', {
      name: /información del banner/i,
    });

    expect(bannerAdjustments).toBeInTheDocument();
    expect(bannerInformation).toBeInTheDocument();
  });

  test('Should render title', async () => {
    await renderComponent();
    const title = screen.getByText(heroBannerMock.title);
    expect(title).toBeInTheDocument();
  });

  test('Should render description and description', async () => {
    await renderComponent();
    const description = screen.getByText(heroBannerMock.description);
    expect(description).toBeInTheDocument();
  });

  test('Should render alignment component', async () => {
    await renderComponent();
    const alignment = screen.getByTestId('banner-alignment');
    expect(alignment).toBeInTheDocument();
  });

  test('Should render show data switch', async () => {
    await renderComponent();
    const visibilitySwitch = screen.getByTestId('show-data-switch');
    expect(visibilitySwitch).toBeInTheDocument();
  });

  test('Should render active switch', async () => {
    await renderComponent();
    const activeSwitch = screen.getByTestId('active-switch');
    expect(activeSwitch).toBeInTheDocument();
  });

  test('Should render position badge', async () => {
    await renderComponent();
    const position = screen.getByText(String(heroBannerMock.position));
    expect(position).toBeInTheDocument();
  });

  test('Should show visible status when banner is active', async () => {
    await renderComponent();
    const bannerVisibilityStatus = screen.getByText(/^visible$/i);
    expect(bannerVisibilityStatus).toBeInTheDocument();
  });

  test('Should show hidden status when banner is not active', async () => {
    vi.mocked(fetchHeroBannerAction).mockResolvedValue({
      ...defaultResponse,
      heroBanner: { ...heroBannerMock, active: false },
    });
    const ServerComponent = await BannerView({
      params: Promise.resolve({ id: heroBannerMock.id }),
    });
    render(ServerComponent, { wrapper: TooltipProvider });

    expect(screen.getByText(/^oculto$/i)).toBeInTheDocument();
  });

  test('Should render the updated date', async () => {
    await renderComponent();

    const updatedDate = format(
      new Date(heroBannerMock.updatedAt as Date),
      "d 'de' MMMM 'del' yyyy",
      { locale: es },
    );

    expect(screen.getByText(updatedDate)).toBeInTheDocument();
  });

  test('Should render edit button', async () => {
    await renderComponent();

    expect(screen.getByTestId('edit-banner')).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchHeroBannerAction).mockResolvedValue({
      ok: false,
      message: 'Banner no encontrado',
      heroBanner: null,
    });

    await expect(async () => {
      await BannerView({ params: Promise.resolve({ id: heroBannerMock.id }) });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/banners?error=${encodeURIComponent('Banner no encontrado')}`,
    );
  });
});
