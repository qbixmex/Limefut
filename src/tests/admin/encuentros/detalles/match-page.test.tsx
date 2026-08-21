import MatchPage from '@/app/admin/encuentros/detalles/[id]/page';
import { render, screen } from '@testing-library/react';

const mockedMatchView = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/encuentros/detalles/[id]/match-view.tsx', () => ({
  MatchView: (props: unknown) => {
    mockedMatchView(props);
    return <div data-testid="match-view" />;
  },
}));

const MATCH_ID = '550e8400-e29b-41d4-a716-446655440001';

describe('Tests on <MatchPage />', () => {
  beforeEach(() => {
    mockedMatchView.mockClear();
  });

  test('Should render correctly', async () => {
    const ServerComponent = await MatchPage({
      params: Promise.resolve({ id: MATCH_ID }),
    });
    render(ServerComponent);

    const title = screen.getByText(/información del encuentro/i);

    expect(title).toBeInTheDocument();
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

    expect(mockedMatchView).toHaveBeenCalledTimes(1);

    const viewProps = mockedMatchView.mock.calls[0][0] as {
      params: Promise<{ id: string }>;
    };

    await expect(viewProps.params).resolves.toEqual({ id: MATCH_ID });
  });
});
