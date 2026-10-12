import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { EditMatch } from '@/app/admin/encuentros/(components)/edit-match';
import { ROUTES } from '@/shared/constants/routes';

const { mockUseSearchParams } = vi.hoisted(() => ({
  mockUseSearchParams: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: mockUseSearchParams,
}));

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Test on <EditMatch /> component', () => {
  const renderComponent = (search = '') => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(search));

    render(
      <EditMatch matchId={matchId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = () => screen.getByRole('link', {
      name: /ir a editar encuentro/i,
    });

    return { user, link };
  };

  test('Should render a link to the edit route with its icon', () => {
    const { link } = renderComponent();

    expect(link()).toBeInTheDocument();
    expect(link().querySelector('svg')).toBeInTheDocument();
    expect(link()).toHaveAttribute('href', ROUTES.ADMIN_MATCHES_EDIT(matchId));
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, link } = renderComponent();

    await user.hover(link());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/editar/i);
  });
});
