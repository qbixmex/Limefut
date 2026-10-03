import { render, screen } from '@testing-library/react';
import { LocalAndVisitorTeams } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-teams';

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-team-select-field', () => ({
  LocalTeamSelectField: () => <span data-testid="local-team-select-field" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/visitor-team-select-field', () => ({
  VisitorTeamSelectField: () => <span data-testid="visitor-team-select-field" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/invert-teams', () => ({
  InvertTeams: () => <span data-testid="invert-teams" />,
}));

describe('Test on <LocalAndVisitorTeams />', () => {
  const renderComponent = async () => {
    const ServerComponent = await LocalAndVisitorTeams({ teams: [] });
    return render(ServerComponent);
  };

  test('Should render both team selects and the invert button', async () => {
    await renderComponent();

    expect(screen.getByTestId('local-team-select-field')).toBeInTheDocument();
    expect(screen.getByTestId('visitor-team-select-field')).toBeInTheDocument();
    expect(screen.getByTestId('invert-teams')).toBeInTheDocument();
  });
});
