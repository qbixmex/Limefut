import CategoriesPage from '@/app/admin/categorias/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => null,
}));

vi.mock('@/app/admin/categorias/(components)/create-category', () => ({
  CreateCategory: () => <div data-testid="create-category" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/categorias/categories-view', () => ({
  CategoriesView: () => <div data-testid="categories-view" />,
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on categories page', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CategoriesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });
    expect(heading).toHaveTextContent(/categorías/i);
  });

  test('Should renders <CreateCategory /> component', async () => {
    const ServerComponent = await CategoriesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('create-category')).toBeInTheDocument();
  });

  test('Should renders <CategoriesView /> component', async () => {
    const ServerComponent = await CategoriesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('categories-view')).toBeInTheDocument();
  });
});
