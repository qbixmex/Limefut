import { renderHook, act } from '@testing-library/react';
import { useEditCoach } from '@/app/admin/entrenadores/editar/[id]/use-edit-coach';
import { ROUTES } from '@/shared/constants/routes';
import { coachProfileMock } from '../mocks/coach-profile.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      coachId: string;
    }) => Promise<{ ok: boolean; message: string; coach: null }>
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
  updateCoachAction: mockUpdateAction,
}));

const validData = {
  name: coachProfileMock.name,
  email: coachProfileMock.email,
  phone: coachProfileMock.phone,
  age: coachProfileMock.age,
  nationality: coachProfileMock.nationality,
  description: coachProfileMock.description,
  active: coachProfileMock.active,
};

describe('Tests on useEditCoach hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El entrenador fue actualizado correctamente',
      coach: null,
    });
  });

  test('Should initialize form with coach default values', () => {
    const { result } = renderHook(() => useEditCoach(coachProfileMock));

    const values = result.current.form.getValues();

    expect(values.name).toBe(coachProfileMock.name);
    expect(values.email).toBe(coachProfileMock.email);
    expect(values.phone).toBe(coachProfileMock.phone);
    expect(values.age).toBe(coachProfileMock.age);
    expect(values.nationality).toBe(coachProfileMock.nationality);
    expect(values.description).toBe(coachProfileMock.description);
    expect(values.active).toBe(coachProfileMock.active);
  });

  test('onSubmit should call updateCoachAction with correct params', async () => {
    const { result } = renderHook(() => useEditCoach(coachProfileMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        coachId: coachProfileMock.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(coachProfileMock.name);
    expect(formData.get('email')).toBe(coachProfileMock.email);
    expect(formData.get('phone')).toBe(coachProfileMock.phone);
    expect(formData.get('age')).toBe(String(coachProfileMock.age));
    expect(formData.get('nationality')).toBe(coachProfileMock.nationality);
    expect(formData.get('description')).toBe(coachProfileMock.description);
    expect(formData.get('active')).toBe(String(coachProfileMock.active));
  });

  test('onSubmit should append image when a File is provided', async () => {
    const { result } = renderHook(() => useEditCoach(coachProfileMock));
    const image = new File(['image'], 'coach.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(image);
  });

  test('onSubmit should not append image when no image was provided', async () => {
    const { result } = renderHook(() => useEditCoach(coachProfileMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCoach(coachProfileMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('El entrenador fue actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_COACHES);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el entrenador',
      coach: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCoach(coachProfileMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el entrenador');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
