import { renderHook, act } from '@testing-library/react';
import { useEditCategory } from '@/app/admin/categorias/(components)/use-edit-category';
import { mockCategory } from './mocks/category.mock';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      authenticatedUserId: string | undefined;
      authenticatedUserRoles: string[] | undefined;
      categoryId: string;
      formData: FormData;
    }) => Promise<{ ok: boolean; message: string }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/categorias/(actions)/update-category.action', () => ({
  updateCategoryAction: mockUpdateAction,
}));

const defaultProps = {
  authenticatedUserId: '881bf0f0-b4d4-4de1-b19e-eb9927d04d99',
  authenticatedUserRoles: ['admin'],
  category: mockCategory,
};

const validData = {
  name: mockCategory.name,
  permalink: mockCategory.permalink,
};

describe('Tests on useEditCategory hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: '¡ La categoría fue actualizada correctamente 👍 !',
    });
  });

  test('Should initialize form with category default values', () => {
    const { result } = renderHook(() => useEditCategory(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe(mockCategory.name);
    expect(values.permalink).toBe(mockCategory.permalink);
  });

  test('handleNavigateBack should navigate to admin categories', () => {
    const { result } = renderHook(() => useEditCategory(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CATEGORIES);
  });

  test('onSubmit should call updateCategoryAction with correct params', async () => {
    const { result } = renderHook(() => useEditCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        authenticatedUserRoles: defaultProps.authenticatedUserRoles,
        categoryId: mockCategory.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(mockCategory.name);
    expect(formData.get('permalink')).toBe(mockCategory.permalink);
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ La categoría fue actualizada correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CATEGORIES);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar la categoría',
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar la categoría');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
