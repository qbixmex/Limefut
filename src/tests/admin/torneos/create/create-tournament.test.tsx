import { render, screen } from '@testing-library/react';
import CreateTournamentPage from '@/app/admin/torneos/crear/page';

vi.mock('@/app/admin/torneos/crear/create-tournament-view', () => ({
  CreateTournamentView: () => null,
}));

describe('Test on <CreateTournamentPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await CreateTournamentPage();
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/crear/i);
  });
});
