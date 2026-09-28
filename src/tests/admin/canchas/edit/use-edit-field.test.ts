import { renderHook, act } from '@testing-library/react';
import { useEditField } from '@/app/admin/canchas/editar/[id]/use-edit-field';
import { ROUTES } from '@/shared/constants/routes';
import { fieldMock } from '../mocks/field.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      fieldId: string;
    }) => Promise<{ ok: boolean; message: string; field: null }>
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

vi.mock('@/app/admin/canchas/(actions)', () => ({
  updateFieldAction: mockUpdateAction,
}));

const validData = {
  name: fieldMock.name,
  permalink: fieldMock.permalink,
  city: fieldMock.city,
  state: fieldMock.state,
  country: fieldMock.country,
  address: fieldMock.address,
  map: fieldMock.map,
};

describe('Tests on useEditField hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: '¡ La cancha fue actualizada correctamente 👍 !',
      field: null,
    });
  });

  test('Should initialize form with field values', () => {
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    const values = result.current.form.getValues();

    expect(values.name).toBe(fieldMock.name);
    expect(values.permalink).toBe(fieldMock.permalink);
    expect(values.city).toBe(fieldMock.city);
    expect(values.state).toBe(fieldMock.state);
    expect(values.country).toBe(fieldMock.country);
    expect(values.address).toBe(fieldMock.address);
    expect(values.map).toBe(fieldMock.map);
  });

  test('onSubmit should call updateFieldAction with correct params', async () => {
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        fieldId: fieldMock.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(fieldMock.name);
    expect(formData.get('permalink')).toBe(fieldMock.permalink);
    expect(formData.get('city')).toBe(fieldMock.city);
    expect(formData.get('state')).toBe(fieldMock.state);
    expect(formData.get('country')).toBe(fieldMock.country);
    expect(formData.get('address')).toBe(fieldMock.address);
    expect(formData.get('map')).toBe(fieldMock.map);
  });

  test('onSubmit should not append optional fields when they are empty', async () => {
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    await act(async () => {
      await result.current.onSubmit({
        name: fieldMock.name,
        permalink: fieldMock.permalink,
        city: '',
        state: '',
        country: '',
        address: '',
        map: '',
      });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('city')).toBeNull();
    expect(formData.get('state')).toBeNull();
    expect(formData.get('country')).toBeNull();
    expect(formData.get('address')).toBeNull();
    expect(formData.get('map')).toBeNull();
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ La cancha fue actualizada correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_FIELDS);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar la cancha',
      field: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar la cancha');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate to fields list', () => {
    const { result } = renderHook(() => useEditField({ field: fieldMock }));

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_FIELDS);
  });
});
