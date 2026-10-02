import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowCoach } from '@/app/admin/entrenadores/(components)/show-coach';

const coachId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <ShowCoach /> component', () => {
  const renderComponent = () => {
    render(<ShowCoach coachId={coachId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /detalles del entrenador/i });
    const toolTip = () => screen.getByRole('tooltip');

    return { user, link, toolTip };
  };

  test('Should render correctly', () => {
    const { link } = renderComponent();

    expect(link).toBeInTheDocument();
    expect(link.querySelector('svg')).toBeInTheDocument();
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', `/admin/entrenadores/perfil/${coachId}`);
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, link, toolTip } = renderComponent();

    await user.hover(link);
    expect(toolTip()).toHaveTextContent(/detalles/i);
  });
});
