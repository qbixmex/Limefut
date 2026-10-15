import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModeSelector } from '@/app/admin/encuentros/(components)/mode-selector';
import { MATCH_MODE } from '@/shared/enums';
import { getMatchMode } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';

const { mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ push: mockPush }),
}));

describe('Test on <ModeSelector />', () => {
  const renderComponent = (search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(<ModeSelector />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', { name: /filtrar por modalidad/i });

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should render the modality placeholder', () => {
    const { combobox } = renderComponent();

    expect(combobox()).toBeInTheDocument();

    const placeholder = screen.getByText(/modalidad/i);
    expect(placeholder).toBeInTheDocument();
  });

  test('Should render match mode options', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    const leagueOption = await screen.findByRole('option', {
      name: getMatchMode(MATCH_MODE.LEAGUE),
    });
    const friendlyOption = await screen.findByRole('option', {
      name: getMatchMode(MATCH_MODE.FRIENDLY),
    });

    expect(leagueOption).toBeInTheDocument();
    expect(friendlyOption).toBeInTheDocument();
  });

  test('Should render the all option', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    const allOption = await screen.findByRole('option', { name: /todas/i });

    expect(allOption).toBeInTheDocument();
  });

  test('Should push the mode param when the league mode is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    const leagueOption = await screen.findByRole('option', {
      name: getMatchMode(MATCH_MODE.LEAGUE),
    });
    await user.click(leagueOption);

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?mode=${MATCH_MODE.LEAGUE}`,
    );
  });

  test('Should push the mode param when the friendly mode is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const friendlyOption = await screen.findByRole('option', { name: getMatchMode(MATCH_MODE.FRIENDLY) });
    await user.click(friendlyOption);

    expect(mockPush).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?mode=${MATCH_MODE.FRIENDLY}`,
    );
  });

  test('Should keep the other search params when a mode is selected', async () => {
    const { user, combobox } = renderComponent('category=sub-15');

    await user.click(combobox());

    const friendlyOption = await screen.findByRole('option', { name: getMatchMode(MATCH_MODE.FRIENDLY) });

    await user.click(friendlyOption);

    expect(mockPush).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?category=sub-15' +
      `&mode=${MATCH_MODE.FRIENDLY}`,
    );
  });

  test('Should remove the mode param when the all option is selected', async () => {
    const { user, combobox } = renderComponent(`mode=${MATCH_MODE.LEAGUE}`);

    await user.click(combobox());

    const allOption = await screen.findByRole('option', { name: /todas/i });

    await user.click(allOption);

    expect(mockPush).toHaveBeenCalledWith(ROUTES.ADMIN_MATCHES);
  });

  test('Should show the clear filter option when a mode is set', async () => {
    const { user, combobox } = renderComponent(`mode=${MATCH_MODE.LEAGUE}`);

    await user.click(combobox());

    const option = await screen.findByRole('option', {
      name: /borrar filtro/i,
    });

    expect(option).toBeInTheDocument();
  });

  test('Should remove the mode param when the clear filter option is selected', async () => {
    const { user, combobox } = renderComponent(`mode=${MATCH_MODE.FRIENDLY}`);

    await user.click(combobox());
    await user.click(await screen.findByRole('option', { name: /borrar filtro/i }));

    expect(mockPush).toHaveBeenCalledWith(ROUTES.ADMIN_MATCHES);
  });

  test('Should not show the clear filter option when there is no mode filter', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    const allOption = await screen.findByRole('option', { name: /todas/i });

    expect(allOption).toBeInTheDocument();

    const filterOption = screen.queryByRole('option', {
      name: /borrar filtro/i,
    });

    expect(filterOption).not.toBeInTheDocument();
  });
});
