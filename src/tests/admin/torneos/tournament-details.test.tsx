import TournamentPage from '@/app/admin/torneos/[id]/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/app/admin/torneos/(components)/edit-tournament', () => ({
  EditTournament: () => <span>Edit Tournament</span>,
}));

vi.mock('@/app/admin/torneos/[id]/tournament-view.tsx', () => ({
  TournamentView: () => <span>Tournament Details</span>,
}));

describe('Test on <TournamentPage />', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await TournamentPage({
      params: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const cardHeading = screen.getByRole('heading', { name: /título/i });

    expect(cardHeading).toBeInTheDocument();
  });
});
