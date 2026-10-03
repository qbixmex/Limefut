import { renderHook, act } from '@testing-library/react';
import { useCreatePlayoffsMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/crear/use-create-playoffs-match';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: { playoffId: string; formData: FormData }) =>
      Promise<{ ok: boolean; message: string; match: { id: string } | null }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/create-playoff-match.action', () => ({
  createPlayoffMatchAction: mockCreateAction,
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

const validData = {
  localTeamId: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  visitorTeamId: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
  fieldId: '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
  localTeamScore: 1,
  visitorTeamScore: 2,
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  round: 'quarterfinal',
  group: 'gold',
  status: 'scheduled' as const,
  referee: 'John Doe',
  remarks: 'Encuentro de ida',
};

describe('Tests on useCreatePlayoffsMatch hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: '¡ Encuentro creado correctamente 👍 !',
      match: { id: '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a' },
    });
  });

  test('Should initialize the form with default values', () => {
    const { result } = renderHook(() => useCreatePlayoffsMatch({ playoffId }));

    const values = result.current.form.getValues();

    expect(values.localTeamId).toBe('');
    expect(values.visitorTeamId).toBe('');
    expect(values.fieldId).toBe('');
    expect(values.localTeamScore).toBe(0);
    expect(values.visitorTeamScore).toBe(0);
    expect(values.group).toBe('');
  });

  test('onSubmit should call createPlayoffMatchAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreatePlayoffsMatch({ playoffId }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith({
      playoffId,
      formData: expect.any(FormData),
    });

    const formData = mockCreateAction.mock.calls[0][0].formData;
    expect(formData.get('localTeamId')).toBe(validData.localTeamId);
    expect(formData.get('visitorTeamId')).toBe(validData.visitorTeamId);
    expect(formData.get('fieldId')).toBe(validData.fieldId);
    expect(formData.get('localTeamScore')).toBe('1');
    expect(formData.get('visitorTeamScore')).toBe('2');
    expect(formData.get('round')).toBe(validData.round);
    expect(formData.get('group')).toBe(validData.group);
    expect(formData.get('status')).toBe(validData.status);
  });

  test('onSubmit should show a success toast, reset and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayoffsMatch({ playoffId }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ Encuentro creado correctamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));

    const values = result.current.form.getValues();
    expect(values.localTeamId).toBe('');
    expect(values.group).toBe('');
  });

  test('onSubmit should show an error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el encuentro',
      match: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreatePlayoffsMatch({ playoffId }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el encuentro');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should reset the form and navigate', () => {
    const { result } = renderHook(() => useCreatePlayoffsMatch({ playoffId }));

    act(() => {
      result.current.form.setValue('group', 'gold');
    });
    act(() => {
      result.current.handleNavigateBack();
    });

    expect(result.current.form.getValues().group).toBe('');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId));
  });
});
