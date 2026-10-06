import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { ShowAnnouncementDetails } from '@/app/admin/noticias/(components)/show-announcement-details';
import { ROUTES } from '@/shared/constants/routes';

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Test on <ShowAnnouncementDetails /> component', () => {
  const renderComponent = () => {
    render(
      <ShowAnnouncementDetails announcementId={announcementId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /detalles de la noticia/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render a link to the details route', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.ADMIN_ANNOUNCEMENTS_SHOW(announcementId));
  });

  test('Should show a tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/detalles/i);
  });
});
