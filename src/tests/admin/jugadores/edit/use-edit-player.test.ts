import { renderHook, act } from '@testing-library/react';
import { useEditPlayer } from '@/app/admin/jugadores/(components)/use-edit-player';
import { playerMock } from '../mocks/player.mock';

const { mockReplace, mockUpdateAction, searchParamsMock } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      playerId: string;
    }) => Promise<{ ok: boolean; message: string }>
  >(),
  searchParamsMock: { value: new URLSearchParams() },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => searchParamsMock.value,
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
    searchParamsMock.value = new URLSearchParams();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El jugador fue actualizado correctamente',
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

    expect(toast.success).toHaveBeenCalledWith('El jugador fue actualizado correctamente');
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

  test('onSubmit should append the image to the form data', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));
    const file = new File(['abc'], 'player.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image: file });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(file);
  });

  test('onSubmit should skip the image when no file is provided', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit({ ...validData, image: undefined });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should append the birthday as an ISO string', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('birthday')).toBe(
      (playerMock.birthday as Date).toISOString(),
    );
  });

  test('Should fall back to undefined for the optional fields that are null', () => {
    const { result } = renderHook(() =>
      useEditPlayer({
        player: { ...playerMock, email: null, phone: null, nationality: null, birthday: null, team: null },
      }),
    );

    const values = result.current.form.getValues();

    expect(values.email).toBeUndefined();
    expect(values.phone).toBeUndefined();
    expect(values.nationality).toBeUndefined();
    expect(values.birthday).toBeUndefined();
    expect(values.teamId).toBe('');
  });

  test('handleNavigateBack should omit the team param when the player has no team', () => {
    const { result } = renderHook(() =>
      useEditPlayer({ player: { ...playerMock, team: null } }),
    );

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith('/admin/jugadores?');
  });

  test('onSubmit should omit the optional fields when they are empty', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit({ ...validData, email: undefined, phone: undefined, nationality: undefined, birthday: undefined });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('email')).toBeNull();
    expect(formData.get('phone')).toBeNull();
    expect(formData.get('nationality')).toBeNull();
    expect(formData.get('birthday')).toBeNull();
  });

  test('onSubmit should forward the tournament and category params on success', async () => {
    searchParamsMock.value = new URLSearchParams(
      'tournament=torneo-a&category=libertadores',
    );

    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      `/admin/jugadores?tournament=torneo-a&category=libertadores&team=${playerMock.team.id}`,
    );
  });

  test('handleNavigateBack should forward the tournament and category params', () => {
    searchParamsMock.value = new URLSearchParams(
      'tournament=torneo-a&category=libertadores',
    );

    const { result } = renderHook(() => useEditPlayer(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(
      `/admin/jugadores?tournament=torneo-a&category=libertadores&team=${playerMock.team.id}`,
    );
  });

  test('onSubmit should default the active flag to false when it is undefined', async () => {
    const { result } = renderHook(() => useEditPlayer(defaultProps));

    await act(async () => {
      await result.current.onSubmit({ ...validData, active: undefined });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('active')).toBe('false');
  });

  test('onSubmit should omit the team param when the player has no team', async () => {
    const { result } = renderHook(() =>
      useEditPlayer({ player: { ...playerMock, team: null } }),
    );

    await act(async () => {
      await result.current.onSubmit({ ...validData, teamId: '' });
    });

    expect(mockReplace).toHaveBeenCalledWith('/admin/jugadores?');
  });
});
