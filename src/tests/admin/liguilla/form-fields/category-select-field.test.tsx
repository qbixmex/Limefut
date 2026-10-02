const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/(actions)/fetch-categories.action', () => ({
  fetchCategoriesAction: vi.fn(),
}));

vi.mock('@/app/(public)/resultados/guardar/category-select/categories-form-select', () => ({
  CategoriesFormSelect: ({ categories }: { categories: unknown[] }) => (
    <div data-testid="categories-form-select">{categories.length}</div>
  ),
}));

import { CategorySelectField } from '@/app/admin/liguilla/(components)/form-fields/category-select-field';
import { render, screen } from '@testing-library/react';
import { fetchCategoriesAction } from '@/app/admin/liguilla/(actions)/fetch-categories.action';
import { categoriesMock } from '../mocks/categories.mock';
import { ROUTES } from '@/shared/constants/routes';

describe('Test on <CategorySelectField />', () => {
  test('Should render <CategoriesFormSelect /> with the categories', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ok: true,
      message: 'Las categorías fueron obtenidas correctamente',
      categories: categoriesMock,
    });

    const ServerComponent = await CategorySelectField({});
    render(ServerComponent);

    const formSelect = screen.getByTestId('categories-form-select');

    expect(formSelect).toHaveTextContent(String(categoriesMock.length));
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchCategoriesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las categorías',
      categories: [],
    });

    await expect(CategorySelectField({})).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS}?error=${encodeURIComponent('Error al obtener las categorías')}`,
    );
  });
});
