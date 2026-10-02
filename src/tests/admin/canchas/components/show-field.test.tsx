import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { ShowField } from '@/app/admin/canchas/(components)/show-field';

const fieldId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <ShowField /> component', () => {
  const renderComponent = () => {
    render(
      <ShowField fieldId={fieldId} />,
      { wrapper: TooltipProvider },
    );
    const user = userEvent.setup();
    const link = screen.getByRole('link', { name: /detalles de la cancha/i });
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

    expect(link).toHaveAttribute('href', `/admin/canchas/${fieldId}`);
  });

  test('Should show tooltip on mouse over', async () => {
    const { link, user, toolTip } = renderComponent();

    await user.hover(link);

    expect(toolTip()).toHaveTextContent(/detalles/i);
  });
});
