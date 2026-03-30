import { CalendarMatches } from '@/app/(public)/components/calendar-matches';
import { render, screen } from '@testing-library/react';
import { fetchPublicMatchesAction } from '@/app/(public)/(actions)/home/fetchPublicMatchesAction';
import { fetchPublicMatchesCountAction } from '@/app/(public)/(actions)/home/fetchPublicMatchesCountAction';
import { nextMatches, matchesDates } from '@/tests/mocks/next_matches';

vi.mock('@/app/(public)/(actions)/home/fetchPublicMatchesAction');
vi.mock('@/app/(public)/(actions)/home/fetchPublicMatchesCountAction');

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('Test on <NextMatches /> component', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicMatchesAction).mockResolvedValue({
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente',
      matches: [],
      pagination: {
        nextMatches: 0,
        totalPages: 0,
      },
    });
    vi.mocked(fetchPublicMatchesCountAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos correctamente',
      matchesDates: [],
    });

    const serverComponent = await CalendarMatches({
      matchesPromise: Promise.resolve({ matchesPage: '1' }),
      selectedDayPromise: Promise.resolve({ selectedDay: '2024-06-01' }),
    });
    render(serverComponent);

    expect(screen.getByText(/calendario/i)).toBeInTheDocument();
    expect(screen.getByText(/no hay encuentros programados/i)).toBeInTheDocument();
  });

  test('Should show next matches', async () => {
    vi.mocked(fetchPublicMatchesAction).mockResolvedValue({
      ok: true,
      message: '! Los encuentros fueron obtenidos correctamente',
      matches: nextMatches,
      pagination: {
        nextMatches: 0,
        totalPages: 1,
      },
    });
    vi.mocked(fetchPublicMatchesCountAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos correctamente',
      matchesDates,
    });

    const serverComponent = await CalendarMatches({
      matchesPromise: Promise.resolve({ matchesPage: '1' }),
      selectedDayPromise: Promise.resolve({ selectedDay: '2024-06-01' }),
    });
    render(serverComponent);

    nextMatches.forEach((match) => {
      expect(screen.getByText(match.localTeam.name)).toBeInTheDocument();
      expect(screen.getByText(match.visitorTeam.name)).toBeInTheDocument();
      expect(screen.getByText(match.matchDate.getDay())).toBeInTheDocument();
      expect(screen.getByText(match.matchDate.getMonth())).toBeInTheDocument();
      expect(screen.getByText(match.matchDate.getFullYear())).toBeInTheDocument();
      const hour = match.matchDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      expect(screen.getByText(new RegExp(hour, 'i'))).toBeInTheDocument();
    });
  });
});
