import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamsSelector } from '@/app/admin/jugadores/(components)/teams-selector';
import { ROUTES } from '@/shared/constants/routes';

const { mockPush, searchParamsMock, pathnameMock } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  pathnameMock: { value: '/admin/jugadores' },
  searchParamsMock: { value: new URLSearchParams() },
}));

vi.mock('next/navigation', () => ({
  useSearchParams: () => searchParamsMock.value,
  usePathname: () => pathnameMock.value,
  useRouter: () => ({ push: mockPush, replace: vi.fn() }),
}));

const teams = [
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'América' },
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'Chivas' },
];

const setParams = (query: string) => {
  searchParamsMock.value = new URLSearchParams(query);
};

describe('Test on <TeamsSelector /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pathnameMock.value = '/admin/jugadores';
    setParams('');
  });

  const renderComponent = () => {
    render(<TeamsSelector teams={teams} />);

    const trigger = screen.getByRole('combobox');
    const user = userEvent.setup();

    return { trigger, user };
  };

  test('Should render correctly with the default placeholder', () => {
    const { trigger } = renderComponent();

    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent(/seleccione un equipo/i);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('Should show the selected team name when the team param matches', () => {
    setParams(`team=${teams[0].id}`);
    const { trigger } = renderComponent();
    const icon = trigger.querySelector('svg');

    expect(trigger).toHaveTextContent('América');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  test('Should show the unassigned label when the team param is "none"', () => {
    setParams('team=none');

    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/jugadores sin equipo asignado/i);
  });

  test('Should show the default placeholder when the team param is unknown', () => {
    setParams('team=missing-id');
    const { trigger } = renderComponent();

    expect(trigger).toHaveTextContent(/seleccione un equipo/i);
  });

  test('Should render the unassigned option and every team when opened', async () => {
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const placeholder = screen.getByPlaceholderText('Buscar equipo');
    const noTeamOption = screen.getByRole('option', { name: /sin equipo asignado/i });
    const firstOption = screen.getByText('América');
    const secondOption = screen.getByText('Chivas');

    expect(placeholder).toBeInTheDocument();
    expect(noTeamOption).toBeInTheDocument();
    expect(firstOption).toBeInTheDocument();
    expect(secondOption).toBeInTheDocument();
  });

  test('Should push the team param when a team is selected', async () => {
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const option = screen.getByRole('option', { name: /equipo américa/i });

    await user.click(option);

    expect(mockPush).toHaveBeenCalledWith(
      ROUTES.ADMIN_PLAYERS +
      '?team=' +
      teams[0].id,
    );
  });

  test('Should push team=none when the unassigned option is selected', async () => {
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const option = screen.getByRole('option', {
      name: /sin equipo asignado/i,
    });

    await user.click(option);

    expect(mockPush).toHaveBeenCalledWith(
      ROUTES.ADMIN_PLAYERS +
      '?team=none',
    );
  });

  test('Should preserve the other search params when selecting a team', async () => {
    setParams('tournament=torneo-a&category=libertadores');
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const option = screen.getByRole('option', { name: /equipo américa/i });
    await user.click(option);

    expect(mockPush).toHaveBeenCalledWith(
      ROUTES.ADMIN_PLAYERS +
      '?tournament=torneo-a' +
      '&category=libertadores' +
      `&team=${teams[0].id}`,
    );
  });

  test('Should close the popover after selecting a team', async () => {
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const option = screen.getByRole('option', { name: /equipo américa/i });
    await user.click(option);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('Should keep the popover closed when a team is selected', async () => {
    const { trigger, user } = renderComponent();

    await user.click(trigger);

    const option = screen.getByRole('option', { name: /equipo américa/i });
    await user.click(option);

    const placeholder = screen.queryByPlaceholderText('Buscar equipo');

    expect(placeholder).not.toBeInTheDocument();
  });
});
