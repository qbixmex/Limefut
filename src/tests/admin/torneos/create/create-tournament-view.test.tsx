import { render, screen } from '@testing-library/react';
import { CreateTournamentView } from '@/app/admin/torneos/crear/create-tournament-view';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: ['user', 'admin'] } }),
    },
  },
}));

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
