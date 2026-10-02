import { render, screen, waitFor } from '@testing-library/react';
import { CreateCategory } from '@/app/admin/categorias/(components)/create-category';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

describe('Test on <CreateCategory /> component', () => {
  const renderComponent = () => {
    render(
      <CreateCategory />,
      { wrapper: TooltipProvider },
    );
    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /ir a crear categoría/i });
    const toolTip = () => screen.getByRole('tooltip');

    return {
      user,
      link,
      toolTip,
    };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', '/admin/categorias/crear');
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();
    await user.hover(link);

    await waitFor(() => {
      expect(toolTip()).toHaveTextContent(/crear/i);
    });
  });
});
