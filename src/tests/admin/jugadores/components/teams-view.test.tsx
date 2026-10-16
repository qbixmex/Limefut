import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { TeamsView } from '@/app/admin/jugadores/(components)/teams-view';

const { shouldSuspend } = vi.hoisted(() => ({
  shouldSuspend: { value: true },
}));

vi.mock('@/app/admin/jugadores/(components)/teams-selector-skeleton', () => ({
  TeamsSelectorSkeleton: () => <div data-testid="teams-selector-skeleton" />,
}));

vi.mock('@/app/admin/jugadores/(components)/teams-selector-wrapper', () => ({
  TeamsSelectorWrapper: () => {
    if (shouldSuspend.value) use(new Promise(() => { }));
    return <div data-testid="teams-selector-wrapper" />;
  },
}));

type SearchParams = {
  tournament?: string;
  category?: string;
  team?: string;
  query?: string;
  page?: string;
};

describe('Test on <TeamsView /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shouldSuspend.value = false;
  });

  test('Should render null when tournament is missing', async () => {
    const ServerComponent = await TeamsView({
      searchParams: Promise.resolve<SearchParams>({
        category: 'primaria-varonil',
      }),
    });
    render(ServerComponent);

    const wrapper = screen.queryByTestId('teams-selector-wrapper');

    expect(wrapper).not.toBeInTheDocument();
  });

  test('Should render null when category is missing', async () => {
    const serverComponent = await TeamsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'torneo-verano',
      }),
    });
    render(serverComponent);

    const wrapper = screen.queryByTestId('teams-selector-wrapper');

    expect(wrapper).not.toBeInTheDocument();
  });

  test('Should render the selector with the teams when both params are present', async () => {
    const serverComponent = await TeamsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'torneo-verano',
        category: 'primaria-varonil',
      }),
    });
    render(serverComponent);

    const teamsSelectorWrapper = screen.queryByTestId('teams-selector-wrapper');

    expect(teamsSelectorWrapper).toBeInTheDocument();
  });

  test('Should render the skeleton while the selector is suspended', async () => {
    shouldSuspend.value = true;
    const serverComponent = TeamsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'torneo-verano',
        category: 'primaria-varonil',
      }),
    });

    await act(async () => {
      render(await serverComponent);
    });

    const skeleton = screen.getByTestId('teams-selector-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
