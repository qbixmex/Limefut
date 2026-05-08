import { LatestResults } from '@/app/(public)/components/latest-results';
import { render, screen } from '@testing-library/react';
import { fetchPublicLatestMatchesAction } from '@/app/(public)/(actions)/home/fetchPublicLatestMatchesAction';
import { latestMatches } from '@/tests/mocks/latest_matches';

vi.mock('@/app/(public)/(actions)/home/fetchPublicLatestMatchesAction');

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/',
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('Test on <LatestResults /> component', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: [],
      pagination: {
        nextMatches: 1,
        totalPages: 1,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({ latestResultsPage: '1' }),
    });
    render(serverComponent);

    expect(screen.getByText(/resultados recientes/i)).toBeInTheDocument();
    expect(screen.getByText(/no hay encuentros recientes/i)).toBeInTheDocument();
  });

  test('Should show latest matches', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: latestMatches,
      pagination: {
        nextMatches: 5,
        totalPages: 16,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({
        latestResultsPage: '1',
        page: '1',
      }),
    });
    render(serverComponent);

    latestMatches.forEach((match) => {
      // Check for links
      expect(screen.getByTestId(`match-${match.id}`))
        .toHaveAttribute('href', '/resultados/' + match.id);
    });
  });

  test('Should show tournament name', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: latestMatches,
      pagination: {
        nextMatches: 5,
        totalPages: 16,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({
        latestResultsPage: '1',
        page: '1',
      }),
    });
    render(serverComponent);

    latestMatches.forEach((match) => {
      expect(
        screen.getAllByRole('heading', {
          level: 3,
          name: match.tournament.name,
        }).length,
      ).toBeGreaterThan(0);
    });
  });

  test('Should show teams names', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: latestMatches,
      pagination: {
        nextMatches: 5,
        totalPages: 16,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({
        latestResultsPage: '1',
        page: '1',
      }),
    });
    render(serverComponent);

    latestMatches.forEach((match) => {
      // Check for teams names
      expect(screen.getByText(match.localTeam.name)).toBeInTheDocument();
      expect(screen.getByText(match.visitorTeam.name)).toBeInTheDocument();
    });
  });

  test('Should show team image', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: latestMatches,
      pagination: {
        nextMatches: 5,
        totalPages: 16,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({
        latestResultsPage: '1',
        page: '1',
      }),
    });
    render(serverComponent);

    latestMatches.forEach((match) => {
      // Check form teams images
      const localTeamImage = screen.getByAltText(`Escudo del equipo ${match.localTeam.name}`);
      const visitorTeamImage = screen.getByAltText(`Escudo del equipo ${match.visitorTeam.name}`);

      expect(localTeamImage).toBeInTheDocument();
      expect(visitorTeamImage).toBeInTheDocument();

      // Since Next.js optimizes images,
      // we need to parse the src attribute to get
      // the original image URL.

      // Local Team Image URL
      const localTeamSource = localTeamImage.getAttribute('src') ?? '';
      const parsedLocalTeamUrl = new URL(localTeamSource, 'http://localhost');
      const originalLocalTeamUrl = parsedLocalTeamUrl.searchParams.get('url');

      // Visitor Team Image URL
      const visitorTeamSource = visitorTeamImage.getAttribute('src') ?? '';
      const parsedVisitorTeamUrl = new URL(visitorTeamSource, 'http://localhost');
      const originalVisitorTeamUrl = parsedVisitorTeamUrl.searchParams.get('url');

      expect(originalLocalTeamUrl).toBe(match.localTeam.imageUrl);
      expect(originalVisitorTeamUrl).toBe(match.visitorTeam.imageUrl);
    });
  });

  test('Should show match scores', async () => {
    vi.mocked(fetchPublicLatestMatchesAction).mockResolvedValue({
      ok: true,
      message: 'Encuentros obtenidos exitosamente',
      matches: latestMatches,
      pagination: {
        nextMatches: 5,
        totalPages: 16,
      },
    });

    const serverComponent = await LatestResults({
      resultsPromise: Promise.resolve({
        latestResultsPage: '1',
        page: '1',
      }),
    });
    render(serverComponent);

    latestMatches.forEach((match) => {
      expect(
        screen.getByLabelText(`Goles del equipo local ${match.localTeam.name}`),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`Goles del equipo visitante ${match.visitorTeam.name}`),
      ).toBeInTheDocument();
    });
  });
});
