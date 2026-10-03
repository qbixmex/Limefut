import { renderHook, act } from '@testing-library/react';
import { useEditPlayoffsMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/use-edit-playoffs-match';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_ID, PLAYOFF_ID, playoffMatchForEditMock } from '../mocks/playoff-match-for-edit.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: { matchId: string; formData: FormData }) =>
      Promise<{ ok: boolean; message: string; match: { id: string } | null }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match.action', () => ({
  updatePlayoffMatchAction: mockUpdateAction,
}));

const validData = {
  localTeamId: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  visitorTeamId: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
  fieldId: '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
  localTeamScore: 3,
  visitorTeamScore: 2,
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  round: 'quarterfinal',
  group: 'gold',
  status: 'completed' as const,
  referee: 'Jane Doe',
  remarks: 'Encuentro de vuelta',
};

describe('Tests on useEditPlayoffsMatch hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El encuentro fue actualizado correctamente',
      match: { id: MATCH_ID },
    });
  });

  test('Should initialize the form from the match', () => {
    const { result } = renderHook(() =>
      useEditPlayoffsMatch({ playoffId: PLAYOFF_ID, match: playoffMatchForEditMock }),
    );

    const values = result.current.form.getValues();

    expect(values.localTeamId).toBe(playoffMatchForEditMock.localTeam.id);
    expect(values.visitorTeamId).toBe(playoffMatchForEditMock.visitorTeam.id);
    expect(values.localTeamScore).toBe(playoffMatchForEditMock.localScore);
    expect(values.visitorTeamScore).toBe(playoffMatchForEditMock.visitorScore);
    expect(values.group).toBe(playoffMatchForEditMock.group);
    expect(values.round).toBe(playoffMatchForEditMock.round);
  });

  test('onSubmit should call updatePlayoffMatchAction with the correct FormData', async () => {
    const { result } = renderHook(() =>
      useEditPlayoffsMatch({ playoffId: PLAYOFF_ID, match: playoffMatchForEditMock }),
    );

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      matchId: MATCH_ID,
      formData: expect.any(FormData),
    });

    const formData = mockUpdateAction.mock.calls[0][0].formData;
    expect(formData.get('localTeamId')).toBe(validData.localTeamId);
    expect(formData.get('visitorTeamId')).toBe(validData.visitorTeamId);
    expect(formData.get('localTeamScore')).toBe('3');
    expect(formData.get('group')).toBe(validData.group);
    expect(formData.get('status')).toBe(validData.status);
  });

  test('onSubmit should show a success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() =>
      useEditPlayoffsMatch({ playoffId: PLAYOFF_ID, match: playoffMatchForEditMock }),
    );

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('El encuentro fue actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS_MATCHES(PLAYOFF_ID));
  });

  test('onSubmit should show an error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el encuentro',
      match: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() =>
      useEditPlayoffsMatch({ playoffId: PLAYOFF_ID, match: playoffMatchForEditMock }),
    );

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el encuentro');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate back to the matches list', () => {
    const { result } = renderHook(() =>
      useEditPlayoffsMatch({ playoffId: PLAYOFF_ID, match: playoffMatchForEditMock }),
    );

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_PLAYOFFS_MATCHES(PLAYOFF_ID));
  });
});
