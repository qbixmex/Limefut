import { renderHook, act } from '@testing-library/react';
import { useCreatePlayer } from '@/app/admin/jugadores/(components)/use-create-player';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction, searchParamsMock } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: {
      formData: FormData;
    }) => Promise<{ ok: boolean; message: string; player: null }>
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

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  createPlayerAction: mockCreateAction,
}));

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
    searchParamsMock.value = new URLSearchParams();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Jugador creado correctamente',
      player: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreatePlayer());

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
    const { result } = renderHook(() => useCreatePlayer());

    act(() => result.current.handleNavigateBack());

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.teamId).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_PLAYERS}?`);
  });

  test('onSubmit should call createPlayerAction with correct params', async () => {
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(
      expect.objectContaining({
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
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Jugador creado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_PLAYERS}?`);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el jugador',
      player: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el jugador');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('onSubmit should append the image to the form data', async () => {
    const { result } = renderHook(() => useCreatePlayer());
    const file = new File(['abc'], 'player.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image: file });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(file);
  });

  test('onSubmit should skip the image when no file is provided', async () => {
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit({ ...validData, image: undefined });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should append the birthday as an ISO string', async () => {
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('birthday')).toBe(validData.birthday.toISOString());
  });

  test('onSubmit should omit the optional fields when they are empty', async () => {
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit({
        name: 'Test Player',
        active: false,
        teamId: '',
      });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe('Test Player');
    expect(formData.get('email')).toBeNull();
    expect(formData.get('phone')).toBeNull();
    expect(formData.get('nationality')).toBeNull();
    expect(formData.get('birthday')).toBeNull();
    expect(formData.get('active')).toBe('false');
    expect(formData.get('teamId')).toBe('');
  });

  test('onSubmit should forward the tournament param on success', async () => {
    searchParamsMock.value = new URLSearchParams('tournament=torneo-a&other=x');

    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYERS}?tournament=torneo-a`,
    );
  });

  test('handleNavigateBack should forward the tournament param', () => {
    searchParamsMock.value = new URLSearchParams('tournament=torneo-a');

    const { result } = renderHook(() => useCreatePlayer());

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYERS}?tournament=torneo-a`,
    );
  });

  test('onSubmit should default the active flag to false when it is undefined', async () => {
    const { result } = renderHook(() => useCreatePlayer());

    await act(async () => {
      await result.current.onSubmit({ ...validData, active: undefined });
    });

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('active')).toBe('false');
  });
});
