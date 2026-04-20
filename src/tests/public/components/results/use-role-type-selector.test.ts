import { renderHook } from '@testing-library/react';
import { useRoleTypeSelector } from '@/app/(public)/components/roles';

const { pushMock, useSearchParamsMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  useSearchParamsMock: vi.fn(() => ({
    get: () => null,
    toString: () => '',
  })),
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/resultados',
  useRouter: () => ({ push: pushMock }),
  useSearchParams: useSearchParamsMock,
}));

describe('Tests on <RoleTypeSelector />', () => {
  test("Should set push '/resultados/roles=complete' to url", async () => {
    const param = 'complete';
    const { result } = renderHook(() => useRoleTypeSelector());

    result.current.handleRoleSelection(param);

    expect(pushMock).toHaveBeenCalledWith(`/resultados?roles=${param}`);
  });

  test("Should set push '/resultados/roles=team' to url", async () => {
    const param = 'team';
    const { result } = renderHook(() => useRoleTypeSelector());

    result.current.handleRoleSelection(param);

    expect(pushMock).toHaveBeenCalledWith(`/resultados?roles=${param}`);
  });

  test("Should set push '/resultados/roles=field' to url", async () => {
    const param = 'field';
    const { result } = renderHook(() => useRoleTypeSelector());

    result.current.handleRoleSelection(param);

    expect(pushMock).toHaveBeenCalledWith(`/resultados?roles=${param}`);
  });

  test("Should remove 'completed' param from url when already selected", async () => {
    vi.mocked(useSearchParamsMock).mockReturnValue({
      get: (key: string) => (key === 'roles' ? 'complete' : null),
      toString: () => 'roles=complete',
    } as never);

    const { result } = renderHook(() => useRoleTypeSelector());
    result.current.handleRoleSelection('complete');

    expect(pushMock).toHaveBeenCalledWith('/resultados');
  });

  test("Should remove 'team' param from url when already selected", async () => {
    vi.mocked(useSearchParamsMock).mockReturnValue({
      get: (key: string) => (key === 'roles' ? 'team' : null),
      toString: () => 'roles=team',
    } as never);

    const { result } = renderHook(() => useRoleTypeSelector());
    result.current.handleRoleSelection('team');

    expect(pushMock).toHaveBeenCalledWith('/resultados');
  });

  test("Should remove 'cancha' param from url when already selected", async () => {
    vi.mocked(useSearchParamsMock).mockReturnValue({
      get: (key: string) => (key === 'roles' ? 'field' : null),
      toString: () => 'roles=field',
    } as never);

    const { result } = renderHook(() => useRoleTypeSelector());
    result.current.handleRoleSelection('field');

    expect(pushMock).toHaveBeenCalledWith('/resultados');
  });
});
