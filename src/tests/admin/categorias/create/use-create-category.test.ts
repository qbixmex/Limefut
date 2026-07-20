import { renderHook, act } from '@testing-library/react';
import { useCreateCategory } from '@/app/admin/categorias/(components)/useCreateCategory';
import { mockCategory } from '../edit/mocks/category.mock';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: {
      authenticatedUserId: string | undefined;
      authenticatedUserRoles: string[] | undefined;
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

vi.mock('@/app/admin/categorias/(actions)/create-category.action', () => ({
  createCategoryAction: mockCreateAction,
}));

const defaultProps = {
  authenticatedUserId: '881bf0f0-b4d4-4de1-b19e-eb9927d04d99',
  authenticatedUserRoles: ['admin'],
};

const validData = {
  name: 'Nueva Categoría',
  permalink: 'nueva-categoria',
};

describe('Tests on useCreateCategory hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: '¡ La categoría fue creada correctamente 👍 !',
    });
  });

  test('Should initialize form with empty default values when no category', () => {
    const { result } = renderHook(() => useCreateCategory(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.permalink).toBe('');
  });

  test('Should initialize form with category default values in edit mode', () => {
    const { result } = renderHook(() =>
      useCreateCategory({ ...defaultProps, category: mockCategory }),
    );

    const values = result.current.form.getValues();

    expect(values.name).toBe(mockCategory.name);
    expect(values.permalink).toBe(mockCategory.permalink);
  });

  test('handleNavigateBack should reset form and navigate when no category', () => {
    const { result } = renderHook(() => useCreateCategory(defaultProps));

    act(() => result.current.handleNavigateBack());

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.permalink).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CATEGORIES);
  });

  test('handleNavigateBack should navigate without reset in edit mode', () => {
    const { result } = renderHook(() =>
      useCreateCategory({ ...defaultProps, category: mockCategory }),
    );

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CATEGORIES);
  });

  test('onSubmit should call createCategoryAction with correct params', async () => {
    const { result } = renderHook(() => useCreateCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        authenticatedUserRoles: defaultProps.authenticatedUserRoles,
      }),
    );

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('permalink')).toBe(validData.permalink);
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ La categoría fue creada correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CATEGORIES);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear la categoría',
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateCategory(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear la categoría');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
