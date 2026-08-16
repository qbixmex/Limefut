import { render, screen } from '@testing-library/react';
import { CreateTournamentView } from '@/app/admin/torneos/crear/create-tournament-view';

vi.mock('@/app/admin/torneos/crear/create-tournament-form', () => ({
  CreateTournamentForm: () => <span data-testid="create-tournament-form" />,
}));

describe('Test on <CreateTournamentView />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CreateTournamentView();
    render(ServerComponent);

    const form = screen.getByTestId('create-tournament-form');

    expect(form).toBeInTheDocument();
  });
});
