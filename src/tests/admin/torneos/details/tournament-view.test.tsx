import { TournamentView } from '@/app/admin/torneos/[id]/tournament-view';
import { render, screen } from '@testing-library/react';
import { tournamentMock } from '../mocks/tournament.mock';
import { fetchTournamentAction } from '@/app/admin/torneos/(actions)/fetch-tournament.action';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
    },
  },
}));

vi.mock('@/app/admin/torneos/(actions)/fetch-tournament.action');

vi.mock('@/app/admin/torneos/(components)/delete-tournament-image/index', () => ({
  DeleteTournamentImage: () => <span data-testid="delete-tournament-image" />,
}));

describe('Test on <TournamentView />', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los torneos fueron obtenidos satisfactoriamente',
    tournament: tournamentMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  test('Should render correctly', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const mainComponent = screen.getByTestId('tournament-details');

    expect(mainComponent).toBeInTheDocument();
  });

  test('Should show tournament image', async () => {
    tournamentMock.imageUrl = 'https://res.cloudinary.com/custom-username/image/upload/v3594830658/tournaments/jovenes-promesas.webp';
    tournamentMock.imagePublicID = 'jovenes-promesas-2026-01-01_12-25-08.145';
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const image = screen.getByRole('img', { name: /imagen del torneo/i });

    expect(image).toBeInTheDocument();
  });

  test('Should show an icon instead tournament image', async () => {
    tournamentMock.imageUrl = null;
    tournamentMock.imagePublicID = null;
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const icon = screen.getByRole('img', { name: /trofeo/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should contains a delete tournament image', async () => {
    tournamentMock.imageUrl = 'https://res.cloudinary.com/custom-username/image/upload/v3594830658/tournaments/jovenes-promesas.webp';
    tournamentMock.imagePublicID = 'jovenes-promesas-2026-01-01_12-25-08.145';
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const deleteButton = screen.getByTestId('delete-tournament-image');

    expect(deleteButton).toBeInTheDocument();
  });

  test('Should shows tournament name', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentName = screen.getByText(tournamentMock.name);

    expect(tournamentName).toBeInTheDocument();
  });

  test('Should shows tournament permalink', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentPermalink = screen.getByText(tournamentMock.permalink);

    expect(tournamentPermalink).toBeInTheDocument();
  });

  test('Should shows tournament country', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentCountry = screen.getByText(tournamentMock.country as string);

    expect(tournamentCountry).toBeInTheDocument();
  });

  test('Should shows a country placeholder if is null', async () => {
    tournamentMock.country = null;
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentCountry = screen.getByRole('text', { name: /país/i });

    expect(tournamentCountry).toHaveTextContent(/no disponible/i);
  });

  test('Should shows tournament season', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentSeason = screen.getByText(tournamentMock.season as string);

    expect(tournamentSeason).toBeInTheDocument();
  });

  test('Should shows a season placeholder if is null', async () => {
    tournamentMock.season = null;
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentSeason = screen.getByRole('text', { name: /temporada/i });

    expect(tournamentSeason).toHaveTextContent(/no disponible/i);
  });

  test('Should shows tournament cities', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentCities = screen.getByRole('text', { name: /ciudades/i });

    expect(tournamentCities).toHaveTextContent(tournamentMock.cities.join(', '));
  });

  test('Should shows tournament cities placeholder if cities are an empty array', async () => {
    tournamentMock.cities = [];
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const tournamentCities = screen.getByRole('text', { name: /ciudades/i });

    expect(tournamentCities).toHaveTextContent(/no disponibles/i);
  });

  test('Should shows tournament start date', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const dateElement = screen.getByRole('text', { name: /fecha inicial/i });
    const startDate = format(tournamentMock.startDate, "d 'de' MMMM 'del' yyyy", { locale: es });

    expect(dateElement).toHaveTextContent(startDate);
  });

  test('Should shows tournament end date', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const dateElement = screen.getByRole('text', { name: /fecha final/i });
    const endDate = format(tournamentMock.endDate, "d 'de' MMMM 'del' yyyy", { locale: es });

    expect(dateElement).toHaveTextContent(endDate);
  });

  test('Should shows active badge', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const badge = screen.getByRole('status', { name: /torneo activo/i });

    expect(badge).toBeInTheDocument();
  });

  test('Should shows inactive badge', async () => {
    const response = structuredClone(defaultResponse);
    response.tournament.active = false;
    vi.mocked(fetchTournamentAction).mockResolvedValue(response);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const badge = screen.getByRole('status', { name: /torneo desactivado/i });

    expect(badge).toBeInTheDocument();
  });

  test('Should shows tournament description', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const description = screen.getByRole('paragraph', { name: /descripción/i });

    expect(description).toHaveTextContent(tournamentMock.description as string);
  });

  test('Should shows a description placeholder if is null', async () => {
    const response = structuredClone(defaultResponse);
    response.tournament.description = null;
    vi.mocked(fetchTournamentAction).mockResolvedValue(response);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const badge = screen.getByRole('status', { name: /descripción/i });

    expect(badge).toHaveTextContent(/no suministrada/i);
  });

  test('Should shows categories length', async () => {
    const response = structuredClone(defaultResponse);
    vi.mocked(fetchTournamentAction).mockResolvedValue(response);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const categoriesHeading = screen.getByRole('heading', {
      level: 2,
      name: /categorías/i,
    });

    expect(categoriesHeading).toHaveTextContent(`Categorías (${response.tournament.categories.length})`);
  });

  test('Should shows categories badges', async () => {
    vi.mocked(fetchTournamentAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    for (const category of tournamentMock.categories) {
      const badge = screen.getByRole('status', { name: category.name });
      expect(badge).toBeInTheDocument();
    }
  });

  test('Should shows no categories placeholder', async () => {
    const response = structuredClone(defaultResponse);
    response.tournament.categories = [];
    vi.mocked(fetchTournamentAction).mockResolvedValue(response);
    const ServerComponent = await TournamentView({
      paramsPromise: Promise.resolve({
        id: 'aa6ee3ae-2149-4320-b333-6d0bc93527ea',
      }),
    });
    render(ServerComponent);

    const badge = screen.getByRole('status', { name: /sin categorías/i });

    expect(badge).toHaveTextContent(/no disponibles/i);
  });
});
