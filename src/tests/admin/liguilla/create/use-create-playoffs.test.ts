import { renderHook, act } from '@testing-library/react';
import { useCreatePlayoffs } from '@/app/admin/liguilla/crear/use-create-playoffs';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: { formData: FormData }) => Promise<{ ok: boolean; message: string; playoff: null }>
  >(),
}));

const searchParamsState = vi.hoisted(() => ({ value: '' }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(searchParamsState.value),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/liguilla/(actions)/create-playoff.action', () => ({
  createPlayoffAction: mockCreateAction,
}));

const teamIds = [
  '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
];

const validData = {
  tournament: 'torneo-de-apertura-2026',
  category: 'varonil',
  teamsIds: teamIds,
  startingRound: 'quarterfinal',
};

describe('Tests on useCreatePlayoffs hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParamsState.value = '';
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Liguilla creada correctamente',
      playoff: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreatePlayoffs());

    const values = result.current.form.getValues();

    expect(values.tournament).toBe('');
    expect(values.category).toBe('');
    expect(values.teamsIds).toEqual([]);
    expect(values.startingRound).toBe('');
  });

  test('Should initialize tournament and category from search params', () => {
    searchParamsState.value = 'tournament=torneo-de-apertura-2026&category=varonil';

    const { result } = renderHook(() => useCreatePlayoffs());

    const values = result.current.form.getValues();

    expect(values.tournament).toBe('torneo-de-apertura-2026');
    expect(values.category).toBe('varonil');
  });

  test('onSubmit should call createPlayoffAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreatePlayoffs());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith({ formData: expect.any(FormData) });

    const formData = mockCreateAction.mock.calls[0][0].formData;
    expect(formData.get('tournament')).toBe(validData.tournament);
    expect(formData.get('category')).toBe(validData.category);
    expect(formData.get('teamsIds')).toBe(JSON.stringify(validData.teamsIds));
    expect(formData.get('startingRound')).toBe(validData.startingRound);
  });

  test('onSubmit should show success toast, reset and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayoffs());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Liguilla creada correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS);

    const values = result.current.form.getValues();
    expect(values.tournament).toBe('');
    expect(values.category).toBe('');
    expect(values.teamsIds).toEqual([]);
    expect(values.startingRound).toBe('');
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear la liguilla',
      playoff: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayoffs());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear la liguilla');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should reset the form and navigate', () => {
    const { result } = renderHook(() => useCreatePlayoffs());

    act(() => {
      result.current.form.setValue('tournament', validData.tournament);
    });
    act(() => {
      result.current.handleNavigateBack();
    });

    expect(result.current.form.getValues().tournament).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS);
  });
});
