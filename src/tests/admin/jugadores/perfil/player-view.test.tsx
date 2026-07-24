import { PlayerView } from '@/app/admin/jugadores/perfil/[id]/player-view';
import { render, screen } from '@testing-library/react';
import { playerMock } from '../mocks/player.mock';
import { fetchPlayerAction } from '@/app/admin/jugadores/(actions)';
import { TooltipProvider } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: ['admin'] } }),
    },
  },
}));

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  fetchPlayerAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
  useSearchParams: vi.fn().mockReturnValue(new URLSearchParams()),
}));

vi.mock('@/app/admin/jugadores/(components)/delete-player-image', () => ({
  DeletePlayerImage: () => <div data-testid="delete-player-image" />,
}));

vi.mock('@/app/admin/jugadores/(components)/edit-player', () => ({
  EditPlayer: () => <div data-testid="edit-player" />,
}));

describe('Tests on PlayerView', () => {
  const defaultResponse = {
    ok: true,
    message: '¡ Se obtuvo el jugador correctamente 👍 !',
    player: playerMock,
  };

  test('Should render component correctly', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    expect(screen.getByTestId('player-content')).toBeInTheDocument();
  });

  test('Should render player name', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    expect(screen.getByText(playerMock.name)).toBeInTheDocument();
  });

  test('Should render email', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /correo electrónico/i });
    expect(badge).toHaveTextContent(playerMock.email);
  });

  test('Should show fallback when email is null', async () => {
    const response = {
      ...defaultResponse,
      player: {
        ...playerMock,
        email: null,
      },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /correo electrónico/i });
    expect(badge).toHaveTextContent(/no proporcionado/i);
  });

  test('Should render phone', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /teléfono/i });
    expect(badge).toHaveTextContent(playerMock.phone);
  });

  test('Should show fallback when phone is null', async () => {
    const response = {
      ...defaultResponse,
      player: {
        ...playerMock,
        phone: null,
      },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /teléfono/i });
    expect(badge).toHaveTextContent(/no proporcionado/i);
  });

  test('Should render birthday', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /fecha de nacimiento/i });
    expect(badge).toHaveTextContent(
      format(playerMock.birthday, "d 'de' MMMM 'del' yyyy", { locale: es }),
    );
  });

  test('Should show fallback when birthday is null', async () => {
    const response = {
      ...defaultResponse,
      player: {
        ...playerMock,
        birthday: null,
      },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /fecha de nacimiento/i });
    expect(badge).toHaveTextContent(/no proporcionado/i);
  });

  test('Should render nationality', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    expect(screen.getByText(playerMock.nationality)).toBeInTheDocument();
  });

  test('Should render team name', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /equipo/i });
    expect(badge).toHaveTextContent(playerMock.team.name);
  });

  test('Should show fallback when team name is null', async () => {
    const response = {
      ...defaultResponse,
      player: {
        ...playerMock,
        team: null,
      },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const badge = screen.getByRole('status', { name: /equipo/i });
    expect(badge).toHaveTextContent(/sin equipo/i);
  });

  test('Should show player active status', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const status = screen.getByRole('status', { name: /estado/i });
    expect(status).toHaveTextContent(/activo/i);
  });

  test('Should render inactive badge when player is not active', async () => {
    const response = { ...defaultResponse, player: { ...playerMock, active: false } };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const status = screen.getByRole('status', { name: /estado/i });
    expect(status).toHaveTextContent(/no activo/i);
  });

  test('Should render created date', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const createdDate = format(new Date(playerMock.createdAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es });
    expect(screen.getByText(createdDate)).toBeInTheDocument();
  });

  test('Should render updated date', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const updatedDate = format(new Date(playerMock.updatedAt as Date), "d 'de' MMMM 'del' yyyy", { locale: es });
    expect(screen.getByText(updatedDate)).toBeInTheDocument();
  });

  test('Should render image placeholder when no imageUrl', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const icon = screen.getByRole('img', { name: /icono/i });
    expect(icon).toBeInTheDocument();
    expect(
      screen.queryByRole('img', { name: /imagen del jugador/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('delete-player-image'),
    ).not.toBeInTheDocument();
  });

  test('Should render image imageUrl exists', async () => {
    const response = {
      ...defaultResponse,
      player: { ...playerMock, imageUrl: '/images/player.jpg' },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    const playerImage = screen.getByRole('img', { name: /imagen de perfil/i });
    expect(playerImage).toBeInTheDocument();
  });

  test('Should render delete button when imageUrl exists', async () => {
    const response = {
      ...defaultResponse,
      player: { ...playerMock, imageUrl: '/images/player.jpg' },
    };
    vi.mocked(fetchPlayerAction).mockResolvedValue(response);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    expect(screen.getByTestId('delete-player-image')).toBeInTheDocument();
  });

  test('Should render edit button', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await PlayerView({
      params: Promise.resolve({ id: playerMock.id }),
    });
    render(<TooltipProvider>{ServerComponent}</TooltipProvider>);

    expect(screen.getByTestId('edit-player')).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchPlayerAction).mockResolvedValue({
      ok: false,
      message: 'Jugador no encontrado',
      player: null,
    });

    await expect(async () => {
      await PlayerView({ params: Promise.resolve({ id: playerMock.id }) });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/jugadores?error=${encodeURIComponent('Jugador no encontrado')}`,
    );
  });
});
