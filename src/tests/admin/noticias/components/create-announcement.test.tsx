import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { CreateAnnouncement } from '@/app/admin/noticias/(components)/create-announcement';
import { ROUTES } from '@/shared/constants/routes';

describe('Test on <CreateAnnouncement /> component', () => {
  const renderComponent = () => {
    render(<CreateAnnouncement />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /ir a crear noticia/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the create route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_ANNOUNCEMENTS_CREATE);
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    await waitFor(() => {
      expect(toolTip()).toHaveTextContent(/crear/i);
    });
  });
});
