import { renderHook, act } from '@testing-library/react';
import { useCreateMatch } from '@/app/admin/encuentros/crear/use-create-match';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_MODE } from '@/shared/enums';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';

const { mockReplace, mockUseSearchParams, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUseSearchParams: vi.fn(),
  mockCreateAction: vi.fn<
    (params: { formData: FormData }) =>
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

vi.mock('@/app/admin/encuentros/(actions)/create-match.action', () => ({
  createMatchAction: mockCreateAction,
}));

const validData = {
  localTeamId: AMERICA.id,
  localScore: 2,
  visitorTeamId: CHIVAS.id,
  visitorScore: 1,
  fieldId: '',
  referee: 'Fernando García',
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  status: 'scheduled' as const,
  mode: MATCH_MODE.LEAGUE,
  week: 5,
  tournament: LIGA_MX.permalink,
  category: SUB_15.permalink,
};

describe('Tests on useCreateMatch hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Encuentro creado correctamente',
      match: {
        tournament: { permalink: LIGA_MX.permalink },
        category: { permalink: SUB_15.permalink },
        week: 5,
      },
    });
  });

  test('Should initialize the form with default values', () => {
    const { result } = renderHook(() => useCreateMatch());

    const values = result.current.form.getValues();

    expect(values.localTeamId).toBe('');
    expect(values.localScore).toBe(0);
    expect(values.visitorTeamId).toBe('');
    expect(values.visitorScore).toBe(0);
    expect(values.week).toBe(0);
    expect(values.mode).toBeUndefined();
    expect(values.tournament).toBeUndefined();
    expect(values.category).toBeUndefined();
  });

  test('Should use the search params as default tournament and category', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams(`tournament=${LIGA_MX.permalink}&category=${SUB_15.permalink}`),
    );

    const { result } = renderHook(() => useCreateMatch());

    const values = result.current.form.getValues();

    expect(values.tournament).toBe(LIGA_MX.permalink);
    expect(values.category).toBe(SUB_15.permalink);
  });

  test('onSubmit should call createMatchAction with the correct FormData', async () => {
    const { result } = renderHook(() => useCreateMatch());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith({ formData: expect.any(FormData) });

    const formData = mockCreateAction.mock.calls[0][0].formData;
    expect(formData.get('localTeamId')).toBe(AMERICA.id);
    expect(formData.get('visitorTeamId')).toBe(CHIVAS.id);
    expect(formData.get('localScore')).toBe('2');
    expect(formData.get('visitorScore')).toBe('1');
    expect(formData.get('status')).toBe('scheduled');
    expect(formData.get('mode')).toBe(MATCH_MODE.LEAGUE);
    expect(formData.get('week')).toBe('5');
    expect(formData.get('tournament')).toBe(LIGA_MX.permalink);
    expect(formData.get('category')).toBe(SUB_15.permalink);
  });

  test('onSubmit should reset the form, show a success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateMatch());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const values = result.current.form.getValues();

    expect(values).toEqual({
      category: undefined,
      fieldId: '',
      localScore: 0,
      localTeamId: '',
      matchDate: undefined,
      mode: undefined,
      referee: undefined,
      status: undefined,
      tournament: undefined,
      visitorScore: 0,
      visitorTeamId: '',
      week: 0,
    });
    expect(toast.success).toHaveBeenCalledWith('Encuentro creado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?tournament=liga-mx' +
      '&category=sub-15' +
      '&sort-week=5',
    );
  });

  test('onSubmit should show an error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el encuentro',
      match: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateMatch());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el encuentro');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate with tournament and category when both are present', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams(`tournament=${LIGA_MX.permalink}&category=${SUB_15.permalink}`),
    );
    const { result } = renderHook(() => useCreateMatch());

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?tournament=${LIGA_MX.permalink}&category=${SUB_15.permalink}`,
    );
  });

  test('handleNavigateBack should keep the remaining search params', () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams('page=2'));
    const { result } = renderHook(() => useCreateMatch());

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(`${ROUTES.ADMIN_MATCHES}?page=2`);
  });

  test('handleNavigateBack should navigate to the list when there are no params', () => {
    const { result } = renderHook(() => useCreateMatch());

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_MATCHES);
  });
});
