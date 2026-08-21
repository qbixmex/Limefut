import MatchPage from '@/app/admin/encuentros/detalles/[id]/page';
import { act, render, screen, waitForElementToBeRemoved } from '@testing-library/react';

const state = vi.hoisted(() => {
  let releaseSuspense: (() => void) | null = null;

  return {
    mockedMatchView: vi.fn(),
    suspended: false,
    suspenseGate: () =>
      new Promise<void>((resolve) => {
        releaseSuspense = () => resolve();
      }),
    releaseSuspense: () => releaseSuspense?.(),
  };
});

vi.mock('@/app/admin/encuentros/detalles/[id]/match-view/index.tsx', () => ({
  MatchView: (props: unknown) => {
    state.mockedMatchView(props);
    if (state.suspended) throw state.suspenseGate();
    return <div data-testid="match-view" />;
  },
}));

const MATCH_ID = '550e8400-e29b-41d4-a716-446655440001';

describe('Tests on <MatchPage />', () => {
  beforeEach(() => {
    state.mockedMatchView.mockClear();
    state.suspended = false;
  });

  test('Should render correctly', async () => {
    const ServerComponent = await MatchPage({
      params: Promise.resolve({ id: MATCH_ID }),
    });
    render(ServerComponent);

    const title = screen.getByText(/información del encuentro/i);

    expect(title).toBeInTheDocument();
  });

  test('Should show skeleton component', async () => {
    state.suspended = true;
    const ServerComponent = await MatchPage({
      params: Promise.resolve({ id: MATCH_ID }),
    });
    render(ServerComponent);

    const skeleton = screen.getByRole('status', { name: /cargando datos/i });

    expect(skeleton).toBeInTheDocument();
  });

  test('Should not show skeleton component', async () => {
    state.suspended = true;
    const ServerComponent = await MatchPage({
      params: Promise.resolve({ id: MATCH_ID }),
    });
    render(ServerComponent);

    const removal = waitForElementToBeRemoved(() =>
      screen.getByRole('status', { name: /cargando datos/i }),
    );

    act(() => {
      state.suspended = false;
      state.releaseSuspense();
    });

    await removal;

    expect(
      screen.queryByRole('status', { name: /cargando datos/i }),
    ).not.toBeInTheDocument();
  });

  test('Should render <MatchView /> component', async () => {
    const ServerComponent = await MatchPage({
      params: Promise.resolve({ id: MATCH_ID }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('match-view')).toBeInTheDocument();
  });

  test('Should pass params to <MatchView /> component', async () => {
    const params = Promise.resolve({ id: MATCH_ID });
    const ServerComponent = await MatchPage({ params });
    render(ServerComponent);

    expect(state.mockedMatchView).toHaveBeenCalledTimes(1);

    const viewProps = state.mockedMatchView.mock.calls[0][0] as {
      params: Promise<{ id: string }>;
    };

    await expect(viewProps.params).resolves.toEqual({ id: MATCH_ID });
  });
});
