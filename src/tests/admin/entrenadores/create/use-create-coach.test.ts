import { renderHook, act } from '@testing-library/react';
import { useCreateCoach } from '@/app/admin/entrenadores/crear/use-create-coach';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (formData: FormData) => Promise<{ ok: boolean; message: string; coach: null }>
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

vi.mock('@/app/admin/entrenadores/(actions)', () => ({
  createCoachAction: mockCreateAction,
}));

const validData = {
  name: 'Test Coach',
  email: 'test-coach@gmail.com',
  phone: '555-444-3333',
  age: 40,
  nationality: 'Mexicana',
  description: 'Entrenador de prueba',
  active: true,
};

describe('Tests on useCreateCoach hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Entrenador creado correctamente',
      coach: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateCoach());

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.email).toBe('');
    expect(values.phone).toBe('');
    expect(values.age).toBeUndefined();
    expect(values.nationality).toBe('');
    expect(values.description).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should call createCoachAction with correct params', async () => {
    const { result } = renderHook(() => useCreateCoach());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('email')).toBe(validData.email);
    expect(formData.get('phone')).toBe(validData.phone);
    expect(formData.get('age')).toBe(String(validData.age));
    expect(formData.get('nationality')).toBe(validData.nationality);
    expect(formData.get('description')).toBe(validData.description);
    expect(formData.get('active')).toBe(String(validData.active));
  });

  test('onSubmit should append image when a File is provided', async () => {
    const { result } = renderHook(() => useCreateCoach());
    const image = new File(['image'], 'coach.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(image);
  });

  test('onSubmit should not append image when is no image was provided', async () => {
    const { result } = renderHook(() => useCreateCoach());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateCoach());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Entrenador creado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_COACHES);
  });

  test('onSubmit should reset form on success', async () => {
    const { result } = renderHook(() => useCreateCoach());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const values = result.current.form.getValues();
    expect(values.name).toBe('');
    expect(values.email).toBe('');
    expect(values.phone).toBe('');
    expect(values.age).toBeUndefined();
    expect(values.nationality).toBe('');
    expect(values.description).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el entrenador',
      coach: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateCoach());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el entrenador');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
