import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { EditVideo } from '@/app/admin/videos/(components)/edit-video';
import { ROUTES } from '@/shared/constants/routes';

const videoId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Test on <EditVideo /> component', () => {
  const renderComponent = () => {
    render(<EditVideo videoId={videoId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /ir a editar video/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the edit route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_VIDEOS_EDIT(videoId));
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/editar/i);
  });
});
