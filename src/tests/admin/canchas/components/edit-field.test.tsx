import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { EditField } from '@/app/admin/canchas/(components)/edit-field';

const fieldId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <EditField /> component', () => {
  test('Should render correctly', () => {
    render(<EditField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const icon = screen.getByRole('img', { name: /icono de lápiz/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    render(<EditField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar cancha/i });
    const user = userEvent.setup();
    await user.hover(link);

    const toolTip = await screen.findByRole('tooltip');
    expect(toolTip).toHaveTextContent(/editar/i);
  });

  test('Should have a link with provided url', () => {
    render(<EditField fieldId={fieldId} />, { wrapper: TooltipProvider });

    const link = screen.getByRole('link', { name: /editar cancha/i });
    expect(link).toHaveAttribute('href', `/admin/canchas/editar/${fieldId}`);
  });
});
