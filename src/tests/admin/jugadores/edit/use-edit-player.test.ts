import { renderHook, act } from '@testing-library/react';
import { useEditPlayer } from '@/app/admin/jugadores/(components)/use-edit-player';
import { playerMock } from '../mocks/player.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      playerId: string;
      userRoles: string[];
      authenticatedUserId: string | undefined;
    }) => Promise<{ ok: boolean; message: string }>
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

vi.mock('@/app/admin/jugadores/(actions)/updatePlayerAction', () => ({
  updatePlayerAction: mockUpdateAction,
}));

const defaultProps = {
  authenticatedUserId: '550e8400-e29b-41d4-a716-446655440000',
  authenticatedUserRoles: ['admin'],
  player: playerMock,
};

const validData = {
  name: playerMock.name,
  email: playerMock.email,
  phone: playerMock.phone,
  nationality: playerMock.nationality,
  birthday: playerMock.birthday,
  active: playerMock.active,
  teamId: playerMock.team.id,
};

describe('Tests on useEditPlayer hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: '¡ El jugador fue actualizado correctamente 👍 !',
    });
  });

  test('Should initialize form with player default values', () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe(playerMock.name);
    expect(values.email).toBe(playerMock.email);
    expect(values.phone).toBe(playerMock.phone);
    expect(values.nationality).toBe(playerMock.nationality);
    expect(values.teamId).toBe(playerMock.team.id);
    expect(values.active).toBe(playerMock.active);
  });

  test('handleNavigateBack should navigate to admin players', () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(
      `/admin/jugadores?team=${playerMock.team.id}`,
    );
  });

  test('onSubmit should call updatePlayerAction with correct params', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        userRoles: defaultProps.authenticatedUserRoles,
        playerId: playerMock.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(playerMock.name);
    expect(formData.get('email')).toBe(playerMock.email);
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ El jugador fue actualizado correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(
      `/admin/jugadores?team=${playerMock.team.id}`,
    );
  });

  test('onSubmit should show error toast on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el jugador',
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el jugador');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
