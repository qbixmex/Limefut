import { renderHook, act } from '@testing-library/react';
import { useCreatePlayer } from '@/app/admin/jugadores/(components)/use-create-player';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: {
      formData: FormData;
      authenticatedUserId: string | null | undefined;
      authenticatedUserRoles: string[] | null | undefined;
    }) => Promise<{ ok: boolean; message: string; player: null }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  createPlayerAction: mockCreateAction,
}));

const defaultProps = {
  authenticatedUserId: '550e8400-e29b-41d4-a716-446655440000',
  authenticatedUserRoles: ['admin'],
};

const validData = {
  name: 'Test Player',
  email: 'test-player@gmail.com',
  phone: '555-444-3333',
  nationality: 'Mexicana',
  birthday: new Date('2000-06-15'),
  active: true,
  teamId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
};

describe('Tests on useCreatePlayer hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: '¡ Jugador creado correctamente 👍 !',
      player: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreatePlayer(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.email).toBeUndefined();
    expect(values.phone).toBeUndefined();
    expect(values.nationality).toBeUndefined();
    expect(values.birthday).toBeUndefined();
    expect(values.active).toBe(false);
    expect(values.teamId).toBe('');
  });

  test('handleNavigateBack should reset form and navigate to admin players', () => {
    const { result } = renderHook(() => useCreatePlayer(defaultProps));

    act(() => result.current.handleNavigateBack());

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.teamId).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_PLAYERS}?`);
  });

  test('onSubmit should call createPlayerAction with correct params', async () => {
    const { result } = renderHook(() => useCreatePlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        authenticatedUserRoles: defaultProps.authenticatedUserRoles,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('email')).toBe(validData.email);
    expect(formData.get('active')).toBe(String(validData.active));
    expect(formData.get('teamId')).toBe(validData.teamId);
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ Jugador creado correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_PLAYERS}?`);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el jugador',
      player: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el jugador');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
