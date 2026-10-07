import { renderHook, act } from '@testing-library/react';
import { useCreateField } from '@/app/admin/canchas/crear/use-create-field';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (formData: FormData) => Promise<{
      ok: boolean;
      message: string;
      field: null;
    }>
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
  createFieldAction: mockCreateAction,
}));

const validData = {
  name: 'Estadio Azteca',
  permalink: 'estadio-azteca',
  city: 'Ciudad de México',
  state: 'CDMX',
  country: 'México',
  address: 'Calzada de Tlalpan 3465',
  map: 'https://maps.app.goo.gl/eYugNe5Cay9cFwex9',
};

describe('Tests on useCreateField hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'La cancha has sido creada satisfactoriamente',
      field: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateField());

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.permalink).toBe('');
    expect(values.city).toBe('');
    expect(values.state).toBe('');
    expect(values.country).toBe('');
    expect(values.address).toBe('');
    expect(values.map).toBe('');
  });

  test('onSubmit should call createFieldAction with correct params', async () => {
    const { result } = renderHook(() => useCreateField());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('permalink')).toBe(validData.permalink);
    expect(formData.get('city')).toBe(validData.city);
    expect(formData.get('state')).toBe(validData.state);
    expect(formData.get('country')).toBe(validData.country);
    expect(formData.get('address')).toBe(validData.address);
    expect(formData.get('map')).toBe(validData.map);
  });

  test('onSubmit should not append optional fields when they are empty', async () => {
    const { result } = renderHook(() => useCreateField());

    await act(async () => {
      await result.current.onSubmit({
        name: 'Estadio Azteca',
        permalink: 'estadio-azteca',
        city: '',
        state: '',
        country: '',
        address: '',
        map: '',
      });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('city')).toBeNull();
    expect(formData.get('state')).toBeNull();
    expect(formData.get('country')).toBeNull();
    expect(formData.get('address')).toBeNull();
    expect(formData.get('map')).toBeNull();
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateField());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('La cancha has sido creada satisfactoriamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_FIELDS);
  });

  test('onSubmit should reset form on success', async () => {
    const { result } = renderHook(() => useCreateField());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const values = result.current.form.getValues();
    expect(values.name).toBe('');
    expect(values.permalink).toBe('');
    expect(values.city).toBe('');
    expect(values.state).toBe('');
    expect(values.country).toBe('');
    expect(values.address).toBe('');
    expect(values.map).toBe('');
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear la cancha',
      field: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateField());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear la cancha');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate to fields list', () => {
    const { result } = renderHook(() => useCreateField());

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_FIELDS);
  });
});
