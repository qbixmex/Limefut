import { act, render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreateMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/create-match';
import { ROUTES } from '@/shared/constants/routes';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Test on <CreateMatch /> component', () => {
  const renderComponent = async () => {
    await act(async () => {
      render(
        <CreateMatch
          playoffIdPromise={Promise.resolve(playoffId)}
        />,
        { wrapper: TooltipProvider },
      );
    });

    const user = userEvent.setup();
    const link = () => screen.getByRole('link', { name: /ir a crear encuentro/i });

    return { user, link };
  };

  test('Should render a link to the create route with its icon', async () => {
    const { link } = await renderComponent();

    expect(link()).toBeInTheDocument();
    expect(link().querySelector('svg')).toBeInTheDocument();
    expect(link()).toHaveAttribute('href', ROUTES.ADMIN_PLAYOFFS_MATCHES_CREATE(playoffId));
  });

  test('Should show the tooltip on mouse over', async () => {
    const { user, link } = await renderComponent();

    await user.hover(link());

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/crear encuentro/i);
  });
});
