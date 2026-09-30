vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/estadisticas/(components)/tournaments-wrapper', () => ({
  TournamentsWrapper: () => <div data-testid="tournaments-wrapper" />,
}));

vi.mock(
  '@/app/admin/estadisticas/(components)/tournaments-wrapper/tournaments-selector-skeleton',
  () => ({
    TournamentsSelectorSkeleton: () => <div data-testid="tournaments-selector-skeleton" />,
  }),
);

vi.mock('@/app/admin/estadisticas/(components)/standings-view', () => ({
  StandingsView: () => <div data-testid="standings-view" />,
}));

import StandingsPage from '@/app/admin/estadisticas/page';
import { render, screen } from '@testing-library/react';

type SearchParams = {
  tournament?: string;
  category?: string;
};

describe('Tests on <StandingsPage />', () => {
  test('Should render the page title', async () => {
    const ServerComponent = await StandingsPage({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    const title = screen.getByText('Estadísticas');

    expect(title).toBeInTheDocument();
  });

  test('Should render the tournaments selector wrapper', async () => {
    const ServerComponent = await StandingsPage({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    const wrapper = screen.getByTestId('tournaments-wrapper');

    expect(wrapper).toBeInTheDocument();
  });

  test('Should render the standings view', async () => {
    const ServerComponent = await StandingsPage({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    const view = screen.getByTestId('standings-view');

    expect(view).toBeInTheDocument();
  });
});
