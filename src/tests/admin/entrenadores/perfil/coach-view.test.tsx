import { CoachView } from '@/app/admin/entrenadores/perfil/[id]/coach-view';
import { render, screen } from '@testing-library/react';
import { coachProfileMock } from '../mocks/coach-profile.mock';
import { fetchCoachDetailsAction } from '@/app/admin/entrenadores/(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ROUTES } from '@/shared/constants/routes';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/entrenadores/(actions)', () => ({
  fetchCoachDetailsAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/entrenadores/(components)/delete-coach-image', () => ({
  DeleteCoachImage: () => <div data-testid="delete-coach-image" />,
}));

vi.mock('@/app/admin/entrenadores/(components)/edit-coach', () => ({
  EditCoach: () => <div data-testid="edit-coach" />,
}));

describe('Tests on CoachView', () => {
  const defaultResponse = {
    ok: true,
    message: 'Entrenador obtenido correctamente',
    coach: coachProfileMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    return render(ServerComponent);
  };

  test('Should render table correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table');

    expect(table).toBeInTheDocument();
  });

  test('Should render coach name', async () => {
    await renderComponent();

    const coachName = screen.getByText(coachProfileMock.name);

    expect(coachName).toBeInTheDocument();
  });

  test('Should render email', async () => {
    await renderComponent();

    const coachEmail = screen.getByText(coachProfileMock.email);

    expect(coachEmail).toBeInTheDocument();
  });

  test('Should show fallback when email is null', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, email: null },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /correo electrónico/i });

    expect(emptyMessage).toHaveTextContent(/no proporcionado/i);
  });

  test('Should render phone', async () => {
    await renderComponent();

    const coachEmail = screen.getByText(coachProfileMock.phone);

    expect(coachEmail).toBeInTheDocument();
  });

  test('Should show fallback when phone is null', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, phone: null },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /teléfono/i });

    expect(emptyMessage).toHaveTextContent(/no proporcionado/i);
  });

  test('Should render age', async () => {
    await renderComponent();

    const coachAge = screen.getByText(coachProfileMock.age.toString());

    expect(coachAge).toBeInTheDocument();
  });

  test('Should show fallback when age is null', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, age: null },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /edad/i });

    expect(emptyMessage).toHaveTextContent(/no proporcionada/i);
  });

  test('Should render nationality', async () => {
    await renderComponent();

    const coachNationality = screen.getByText(coachProfileMock.nationality);

    expect(coachNationality).toBeInTheDocument();
  });

  test('Should show fallback when nationality is null', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, nationality: null },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /nacionalidad/i });

    expect(emptyMessage).toHaveTextContent(/no proporcionada/i);
  });

  test('Should render description', async () => {
    await renderComponent();

    const coachDescription = screen.getByText(coachProfileMock.description);

    expect(coachDescription).toBeInTheDocument();
  });

  test('Should show fallback when description is null', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, description: null },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /descripción/i });

    expect(emptyMessage).toHaveTextContent(/no proporcionada/i);
  });

  test('Should render created date', async () => {
    await renderComponent();

    const createdDate = format(
      new Date(coachProfileMock.createdAt as Date),
      "d 'de' MMMM 'del' yyyy",
      { locale: es },
    );

    const dateText = screen.getByText(createdDate);

    expect(dateText).toBeInTheDocument();
  });

  test('Should render updated date', async () => {
    await renderComponent();

    const updatedDate = format(
      new Date(coachProfileMock.updatedAt as Date),
      "d 'de' MMMM 'del' yyyy",
      { locale: es },
    );

    const dateText = screen.getByText(updatedDate);

    expect(dateText).toBeInTheDocument();
  });

  test('Should show active status', async () => {
    await renderComponent();

    const statusText = screen.getByText(/activo/i);

    expect(statusText).toBeInTheDocument();
  });

  test('Should show inactive status when coach is not active', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, active: false },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const statusText = screen.getByText(/no activo/i);

    expect(statusText).toBeInTheDocument();
  });

  test('Should render singular team heading for one team', async () => {
    await renderComponent();

    const heading = screen.getByRole('heading', { name: 'Equipo', level: 2 });

    expect(heading).toBeInTheDocument();
  });

  test('Should render plural team heading for more than one team', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: {
        ...coachProfileMock,
        teams: [
          ...coachProfileMock.teams,
          {
            id: 'f784c643-c39f-4867-9d7c-9b5c571a84c5',
            name: 'Tigers',
            permalink: 'tigers',
            category: { name: 'Sub-17', permalink: 'sub-17' },
          },
        ],
      },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: 'Equipos' });

    expect(heading).toBeInTheDocument();
  });

  test('Should render team name and category', async () => {
    await renderComponent();

    coachProfileMock.teams.forEach((team) => {
      const badge = screen.getByRole('status', { name: 'Nombre de equipo y categoría' });

      expect(badge).toHaveTextContent(team.name);
      expect(badge).toHaveTextContent(team.category.name);
    });
  });

  test('Should link each team to its detail page', async () => {
    await renderComponent();

    const link = screen.getByTitle(/detalles/i);

    expect(link).toHaveAttribute(
      'href',
      ROUTES.ADMIN_TEAMS_SHOW(coachProfileMock.teams[0].id),
    );
  });

  test('Should render no team badges when coach has no teams', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, teams: [] },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const link = screen.queryByTitle(/detalles/i);

    expect(link).not.toBeInTheDocument();
  });

  test('Should render empty badge message when coach has no teams', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, teams: [] },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', { name: /equipos/i });

    expect(emptyMessage).toHaveTextContent(/sin equipos asignados/i);
  });

  test('Should render image placeholder when no imageUrl', async () => {
    await renderComponent();
    const profileImage = screen.queryByRole('img', { name: /imagen de perfil/i });
    const deleteButton = screen.queryByTestId('delete-coach-image');

    expect(profileImage).not.toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });

  test('Should render image when imageUrl exists', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, imageUrl: '/images/coach.jpg' },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const coachImage = screen.getByRole('img', { name: /imagen de perfil/i });
    expect(coachImage).toBeInTheDocument();
  });

  test('Should render delete button when imageUrl exists', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ...defaultResponse,
      coach: { ...coachProfileMock, imageUrl: '/images/coach.jpg' },
    });
    const ServerComponent = await CoachView({
      params: Promise.resolve({ id: coachProfileMock.id }),
    });
    render(ServerComponent);

    const deleteButton = screen.getByTestId('delete-coach-image');

    expect(deleteButton).toBeInTheDocument();
  });

  test('Should render edit button', async () => {
    await renderComponent();

    const editButton = screen.getByTestId('edit-coach');

    expect(editButton).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchCoachDetailsAction).mockResolvedValue({
      ok: false,
      message: 'Entrenador no encontrado',
      coach: null,
    });

    await expect(async () => {
      await CoachView({ params: Promise.resolve({ id: coachProfileMock.id }) });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/entrenadores?error=${encodeURIComponent('Entrenador no encontrado')}`,
    );
  });
});
