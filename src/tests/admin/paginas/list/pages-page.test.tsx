import PagesPage from '@/app/admin/paginas/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/paginas/(components)/create-page', () => ({
  CreatePage: () => <div data-testid="create-page" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/paginas/(components)/custom-pages.view', () => ({
  CustomPagesView: () => <div data-testid="custom-pages-view" />,
}));

type SearchParams = { query?: string; page?: string };

describe('Tests on paginas page', () => {
  const renderComponent = async () => {
    const ServerComponent = await PagesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    return render(ServerComponent);
  };

  test('Should render heading', async () => {
    await renderComponent();

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/páginas/i);
  });

  test('Should render <Search /> and <CreatePage /> components', async () => {
    await renderComponent();

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('create-page')).toBeInTheDocument();
  });

  test('Should render <CustomPagesView /> component', async () => {
    await renderComponent();

    expect(screen.getByTestId('custom-pages-view')).toBeInTheDocument();
  });
});
