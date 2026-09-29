import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreateField } from '@/app/admin/canchas/(components)/create-field';

describe('Test on <CreateField /> component', () => {
  test('Should render correctly', () => {
    render(<CreateField />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de crear/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<CreateField />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear cancha/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(<CreateField />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear cancha/i });
    expect(link).toHaveAttribute('href', '/admin/canchas/crear');
  });
});
