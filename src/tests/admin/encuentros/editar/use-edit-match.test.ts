import { renderHook, act } from '@testing-library/react';
import { useEditMatch } from '@/app/admin/encuentros/editar/[id]/use-edit-match';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';
import { matchForEditMock, MATCH_ID } from '../mocks/match-for-edit.mock';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';

const { mockReplace, mockUseSearchParams, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUseSearchParams: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: { formData: FormData; matchId: string }) =>
      Promise<{ ok: boolean; message: string; match: unknown }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: mockUseSearchParams,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/app/admin/encuentros/(actions)/update-match.action', () => ({
  updateMatchAction: mockUpdateAction,
}));

const validData = {
  localTeamId: AMERICA.id,
  localScore: 2,
  visitorTeamId: CHIVAS.id,
  visitorScore: 1,
  fieldId: '',
  referee: 'Fernando García',
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  status: MATCH_STATUS.SCHEDULED,
  week: 12,
  tournament: 'liga-mx',
  category: 'sub-15',
};

describe('Tests on useEditMatch hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El encuentro fue actualizado correctamente',
      match: {
        status: MATCH_STATUS.SCHEDULED,
        tournament: { permalink: 'liga-mx' },
        category: { permalink: 'sub-15' },
        week: 12,
      },
    });
  });

  test('Should initialize the form with the match values', () => {
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    const values = result.current.form.getValues();

    expect(values.localTeamId).toBe(AMERICA.id);
    expect(values.visitorTeamId).toBe(CHIVAS.id);
    expect(values.localScore).toBe(2);
    expect(values.visitorScore).toBe(1);
    expect(values.week).toBe(12);
    expect(values.tournament).toBe('liga-mx');
    expect(values.category).toBe('sub-15');
  });

  test('Should not hide the scores for a scheduled match', () => {
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    expect(result.current.hiddenScores).toBe(false);
  });

  test('Should not hide the scores for in progress match', () => {
    const { result } = renderHook(() => useEditMatch({
      match: {
        ...matchForEditMock,
        status: MATCH_STATUS.IN_PROGRESS,
      },
    }));

    expect(result.current.hiddenScores).toBe(false);
  });

  test('Should hide the scores for post posted match', () => {
    const { result } = renderHook(() => useEditMatch({
      match: {
        ...matchForEditMock,
        status: MATCH_STATUS.POST_POSED,
      },
    }));

    expect(result.current.hiddenScores).toBe(true);
  });

  test('Should hide the scores for a completed match', () => {
    const { result } = renderHook(() =>
      useEditMatch({
        match: {
          ...matchForEditMock,
          status: MATCH_STATUS.COMPLETED,
        },
      }),
    );

    expect(result.current.hiddenScores).toBe(true);
  });

  test('Should hide the scores for a canceled match', () => {
    const { result } = renderHook(() =>
      useEditMatch({
        match: {
          ...matchForEditMock,
          status: MATCH_STATUS.CANCELED,
        },
      }),
    );

    expect(result.current.hiddenScores).toBe(true);
  });

  test('onSubmit should call updateMatchAction with the correct FormData', async () => {
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith({
      formData: expect.any(FormData),
      matchId: MATCH_ID,
    });

    const formData = mockUpdateAction.mock.calls[0][0].formData;
    expect(formData.get('localTeamId')).toBe(AMERICA.id);
    expect(formData.get('visitorTeamId')).toBe(CHIVAS.id);
    expect(formData.get('week')).toBe('12');
    expect(formData.get('tournament')).toBe('liga-mx');
  });

  test('onSubmit should show a success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('El encuentro fue actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(
      '/admin/encuentros?tournament=liga-mx&category=sub-15&sort-week=12',
    );
  });

  test('onSubmit should hide the scores when the match becomes completed', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El encuentro fue actualizado correctamente',
      match: {
        status: MATCH_STATUS.COMPLETED,
        tournament: { permalink: 'liga-mx' },
        category: { permalink: 'sub-15' },
        week: 12,
      },
    });
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(result.current.hiddenScores).toBe(true);
  });

  test('onSubmit should show an error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el encuentro',
      match: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el encuentro');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate back keeping the search params', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=2'));
    const { result } = renderHook(() => useEditMatch({ match: matchForEditMock }));

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_MATCHES}?page=2`);
  });
});
