import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TournamentsSelector } from '@/shared/components/tournaments-selector';

const { mockPush, mockReplace } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockReplace: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/admin/equipos',
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
}));

const tournaments = [
  { id: '1', name: 'Torneo A', permalink: 'torneo-a' },
  { id: '2', name: 'Torneo B', permalink: 'torneo-b' },
];

describe('Tests on <TournamentsSelector />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should not show "Sin torneo" when includeNoTournament is false', async () => {
    const user = userEvent.setup();
    render(<TournamentsSelector tournaments={tournaments} />);

    await user.click(screen.getByRole('combobox'));

    expect(screen.queryByText('Sin torneo')).not.toBeInTheDocument();
    expect(screen.getByText('Torneo A')).toBeInTheDocument();
  });

  test('Should show "Sin torneo" when includeNoTournament is true', async () => {
    const user = userEvent.setup();
    render(
      <TournamentsSelector tournaments={tournaments} includeNoTournament />,
    );

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByText('Sin torneo')).toBeInTheDocument();
  });

  test('Should select "Sin torneo" and push tournament=none', async () => {
    const user = userEvent.setup();
    render(
      <TournamentsSelector tournaments={tournaments} includeNoTournament />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Sin torneo'));

    expect(mockPush).toHaveBeenCalledWith('/admin/equipos?tournament=none');
  });
});
