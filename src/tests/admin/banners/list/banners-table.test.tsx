import { render, screen } from '@testing-library/react';
import { BannersTable } from '@/app/admin/banners/(components)/banners-table';
import { heroBannersMock } from '../mocks/hero-banners.mock';

vi.mock('@/app/admin/banners/(actions)', () => ({
  updateHeroBannerStateAction: vi.fn(),
}));

vi.mock('@/app/admin/banners/(components)/show-banner', () => ({
  ShowBanner: () => <span data-testid="show-banner" />,
}));

vi.mock('@/app/admin/banners/(components)/edit-banner', () => ({
  EditBanner: () => <span data-testid="edit-banner" />,
}));

vi.mock('@/app/admin/banners/(components)/delete-banner', () => ({
  DeleteBanner: () => <span data-testid="delete-banner" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on <BannersTable /> component', () => {
  const defaultProps = {
    banners: heroBannersMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
    roles: ['admin'],
  };

  const renderComponent = (props = defaultProps) => render(<BannersTable {...props} />);

  test('Should render correctly', () => {
    renderComponent();

    const table = screen.getByRole('table', { name: /lista de banners/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when no banners', () => {
    renderComponent({ ...defaultProps, banners: [] });

    const emptyMessage = screen.getByText(/no hay banners creados/i);
    const table = screen.queryByRole('table', { name: /lista de banners/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render banner titles', () => {
    renderComponent();

    heroBannersMock.forEach((banner) => {
      expect(screen.getByText(banner.title)).toBeInTheDocument();
    });
  });

  test('Should render a details link with provided url for each banner', () => {
    renderComponent();

    heroBannersMock.forEach((banner) => {
      const link = screen.getByRole('link', {
        name: `Detalles del banner ${banner.title}`,
      });

      expect(link).toHaveAttribute('href', `/admin/banners/${banner.id}`);
    });
  });

  test('Should render images when imageUrl exists', () => {
    renderComponent();

    heroBannersMock.forEach((banner) => {
      const image = screen.getByAltText(banner.title);

      expect(image).toBeInTheDocument();
    });
  });

  test('Should render a placeholder icon when imageUrl is missing', () => {
    renderComponent({
      ...defaultProps,
      banners: [{ ...heroBannersMock[0], imageUrl: '' }],
    });

    const icon = screen.getByRole('img', { name: /icono de banner/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should render data visibility badges', () => {
    renderComponent();

    expect(screen.getByText(/^visible$/i)).toBeInTheDocument();
    expect(screen.getByText(/^oculta$/i)).toBeInTheDocument();
  });

  test('Should render position badges', () => {
    renderComponent();

    heroBannersMock.forEach((banner) => {
      expect(screen.getByText(String(banner.position))).toBeInTheDocument();
    });
  });

  test('Should render an active switch for each banner', () => {
    renderComponent();

    const switches = screen.getAllByTestId('active-switch');

    expect(switches).toHaveLength(heroBannersMock.length);
  });

  test('Should render show banner action for each banner', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('show-banner');

    expect(buttons).toHaveLength(heroBannersMock.length);
  });

  test('Should render edit banner action for each banner', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('edit-banner');

    expect(buttons).toHaveLength(heroBannersMock.length);
  });

  test('Should render delete banner action for each banner', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('delete-banner');

    expect(buttons).toHaveLength(heroBannersMock.length);
  });

  test('Should hide pagination when totalPages is 1', () => {
    renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).toHaveClass('hidden');
  });

  test('Should render pagination when totalPages is greater than 1', () => {
    renderComponent({
      ...defaultProps,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).not.toHaveClass('hidden');
  });
});
