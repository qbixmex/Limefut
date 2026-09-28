import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { CreateCoach } from '@/app/admin/entrenadores/(components)/create-coach';

describe('Test on <CreateCoach /> component', () => {
  test('Should render correctly', () => {
    render(<CreateCoach />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de crear/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<CreateCoach />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear entrenador/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/crear/i);
  });

  test('Should have a link with provided url', () => {
    render(<CreateCoach />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /crear entrenador/i });
    expect(link).toHaveAttribute('href', '/admin/entrenadores/crear');
  });
});
