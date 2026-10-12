import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SelectTournament } from '@/app/admin/encuentros/(components)/selectors/select-tournament';
import { tournamentsMock, LIGA_MX } from '../mocks/tournaments.mock';

const { mockPush, mockUseSearchParams } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({ push: mockPush }),
}));

describe('Test on <SelectTournament />', () => {
  const renderComponent = () => {
    render(<SelectTournament tournaments={tournamentsMock} />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', { name: /seleccionar torneo/i });

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearchParams.mockReturnValue(new URLSearchParams(''));
  });

  test('Should render the tournament options', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());

    expect(await screen.findByRole('option', { name: LIGA_MX.name })).toBeInTheDocument();
  });

  test('Should push the torneo param when a tournament is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    await user.click(await screen.findByRole('option', { name: LIGA_MX.name }));

    expect(mockPush).toHaveBeenCalledWith(`/admin/encuentros?torneo=${LIGA_MX.permalink}`);
  });
});
