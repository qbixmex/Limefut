import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowField } from '@/app/admin/canchas/(components)/show-field';

const fieldId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <ShowField /> component', () => {
  test('Should render correctly', () => {
    render(<ShowField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de detalles/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<ShowField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /detalles de la cancha/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/detalles/i);
  });

  test('Should have a link with provided url', () => {
    render(<ShowField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /detalles de la cancha/i });
    expect(link).toHaveAttribute('href', `/admin/canchas/${fieldId}`);
  });
});
