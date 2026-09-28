import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowCoach } from '@/app/admin/entrenadores/(components)/show-coach';

const coachId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <ShowCoach /> component', () => {
  test('Should render correctly', () => {
    render(<ShowCoach coachId={coachId} />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de detalles/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<ShowCoach coachId={coachId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /detalles del entrenador/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/detalles/i);
  });

  test('Should have a link with provided url', () => {
    render(<ShowCoach coachId={coachId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /detalles del entrenador/i });
    expect(link).toHaveAttribute('href', `/admin/entrenadores/perfil/${coachId}`);
  });
});
