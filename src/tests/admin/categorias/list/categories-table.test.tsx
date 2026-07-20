import { CategoriesTable } from '@/app/admin/categorias/(components)/categories-table';
import { render, screen } from '@testing-library/react';
import { categoriesMock } from '../mocks/categories.mock';
import { fetchCategoriesAction } from '@/app/admin/categorias/(actions)/fetch-categories.action';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
    },
  },
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

    expect(screen.getByRole('table', { name: /tabla/i })).toBeInTheDocument();
  });

  test('Should render empty state when no tournaments', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ...defaultResponse,
      categories: [],
    });

    await renderComponent();

    expect(screen.getByText('Aún no hay categorías creadas')).toBeInTheDocument();
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

    expect(screen.getAllByTestId('edit-category')).toHaveLength(categoriesMock.length);
    expect(screen.getAllByTestId('delete-category')).toHaveLength(categoriesMock.length);
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    await renderComponent();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('Should render error message when fetch fails', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las categorías',
      categories: [],
      pagination: null,
    });

    await renderComponent();

    expect(screen.getByText('Error al obtener las categorías')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
