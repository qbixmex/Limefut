import type { ReactElement } from 'react';
import { render, screen } from '@testing-library/react';
import { CreatePlayoffView } from '@/app/admin/liguilla/crear/create-playoff-view';

let formProps: Record<string, ReactElement> | undefined;

vi.mock('@/app/admin/liguilla/crear/create-playoffs-form', () => ({
  CreatePlayoffsForm: (props: Record<string, ReactElement>) => {
    formProps = props;
    return <div data-testid="create-playoffs-form" />;
  },
}));

vi.mock('@/app/admin/liguilla/(components)/form-fields/tournament-select-field', () => ({
  TournamentSelectField: () => <span data-testid="tournament-select-field" />,
}));

vi.mock('@/app/admin/liguilla/(components)/form-fields/category-select-field', () => ({
  CategorySelectField: () => <span data-testid="category-select-field" />,
}));

vi.mock('@/app/admin/liguilla/(components)/form-fields/teams-select-field', () => ({
  TeamsSelectField: () => <span data-testid="teams-select-field" />,
}));

type SearchParams = { tournament?: string; category?: string };

describe('Test on <CreatePlayoffView />', () => {
  beforeEach(() => {
    formProps = undefined;
  });

  const renderComponent = async (searchParams: SearchParams = {}) => {
    const ServerComponent = await CreatePlayoffView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <CreatePlayoffsForm /> component', async () => {
    await renderComponent();

    const createPlayoffsForm = screen.getByTestId('create-playoffs-form');

    expect(createPlayoffsForm).toBeInTheDocument();
  });

  test('Should pass the tournament and category permalinks to the teams slot', async () => {
    await renderComponent({
      tournament: 'torneo-de-apertura-2026',
      category: 'varonil',
    });

    expect(formProps?.teamsSlot.props).toEqual(
      expect.objectContaining({
        tournamentPermalink: 'torneo-de-apertura-2026',
        categoryPermalink: 'varonil',
      }),
    );
  });

  test('Should pass undefined permalinks when there are no search params', async () => {
    await renderComponent();

    expect(formProps?.teamsSlot.props).toEqual(
      expect.objectContaining({
        tournamentPermalink: undefined,
        categoryPermalink: undefined,
      }),
    );
  });
});
