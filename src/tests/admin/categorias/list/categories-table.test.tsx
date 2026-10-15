import { CategoriesTable } from '@/app/admin/categorias/(components)/categories-table';
import { render, screen } from '@testing-library/react';
import { categoriesMock } from '../mocks/categories.mock';
import { fetchCategoriesAction } from '@/app/admin/categorias/(actions)/fetch-categories.action';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/categorias/(actions)/fetch-categories.action');

vi.mock('@/app/admin/categorias/(components)/edit-category', () => ({
  EditCategory: () => <span data-testid="edit-category" />,
}));

vi.mock('@/app/admin/categorias/(components)/delete-category', () => ({
  DeleteCategory: () => <span data-testid="delete-category" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on categories page', () => {
  const defaultResponse = {
    ok: true,
    message: 'Las categorías fueron obtenidas satisfactoriamente',
    categories: categoriesMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async () => {
    const ServerComponent = await CategoriesTable({
      query: '',
      currentPage: '1',
    });
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue(defaultResponse);
  });

  test('Should render correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /tabla/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when no tournaments', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ...defaultResponse,
      categories: [],
    });

    await renderComponent();

    const emptyMessage = screen.getByText('Aún no hay categorías creadas');

    expect(emptyMessage).toBeInTheDocument();
  });

  test('Should render category name', async () => {
    await renderComponent();

    categoriesMock.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  test('Should render category permalink', async () => {
    await renderComponent();

    categoriesMock.forEach((category) => {
      expect(screen.getByText(category.permalink as string)).toBeInTheDocument();
    });
  });

  test('Should render action buttons', async () => {
    await renderComponent();

    const editCategory = screen.getAllByTestId('edit-category');
    const deleteCategory = screen.getAllByTestId('delete-category');

    expect(editCategory).toHaveLength(categoriesMock.length);
    expect(deleteCategory).toHaveLength(categoriesMock.length);
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    defaultResponse.pagination.totalPages = 2;
    await renderComponent();

    const pagination = screen.getByTestId('pagination');

    expect(pagination).toBeInTheDocument();
  });

  test('Should render error message when fetch fails', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las categorías',
      categories: [],
      pagination: null,
    });

    await renderComponent();

    const errorMessage = screen.getByText('Error al obtener las categorías');
    const table = screen.queryByRole('table');

    expect(errorMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });
});
