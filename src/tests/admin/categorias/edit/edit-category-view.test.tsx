import { render, screen } from '@testing-library/react';
import { mockCategory } from './mocks/category.mock';
import { EditCategoryView } from '@/app/admin/categorias/editar/[id]/edit-category-view';

vi.mock('@/app/admin/categorias/(components)/edit-category-form', () => ({
  EditCategoryForm: () => <span data-testid="edit-category-form" />,
}));

const mockFetchSuccess = vi.fn().mockResolvedValue({
  ok: true,
  message: '¡ Categoría obtenida correctamente 👍 !',
  category: mockCategory,
});

vi.mock('@/app/admin/categorias/(actions)/fetch-category.action', () => ({
  fetchCategoryAction: (...args: unknown[]) => mockFetchSuccess(...args),
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <EditCategoryView />', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    mockFetchSuccess.mockResolvedValue({
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category: mockCategory,
    });
  });

  test('Should render correctly', async () => {
    const element = await EditCategoryView({
      params: Promise.resolve({ id: mockCategory.id }),
    });
    render(element);

    const form = screen.getByTestId('edit-category-form');

    expect(form).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    mockFetchSuccess.mockResolvedValue({
      ok: false,
      message: '¡ La categoría no existe !',
      category: null,
    });

    try {
      await EditCategoryView({
        params: Promise.resolve({ id: mockCategory.id }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });
});
