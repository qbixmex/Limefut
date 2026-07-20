import { render, screen } from '@testing-library/react';
import { CreateCategory } from '@/app/admin/categorias/(components)/create-category';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';

describe('Test on <CreateCategory /> component', () => {
  test('Should render correctly', () => {
    render(
      <CreateCategory />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /crear categoría/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(
      <CreateCategory />,
      { wrapper: TooltipProvider },
    );
    const link = screen.getByRole('link', { name: /crear categoría/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(
      <CreateCategory />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link', { name: /crear categoría/i });
    expect(link).toHaveAttribute('href', '/admin/categorias/crear');
  });
});
