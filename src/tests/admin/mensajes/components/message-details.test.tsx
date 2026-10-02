import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { MessageDetails } from '@/app/admin/mensajes/(components)/message-details';

const messageId = '87554630-ca8c-4bab-826c-458ffbd02414';

describe('Test on <MessageDetails /> component', () => {
  const renderComponent = () => {
    render(
      <MessageDetails messageId={messageId} />,
      { wrapper: TooltipProvider },
    );

    const link = screen.getByRole('link');
    const triggerButton = screen.getByRole('button', { name: /detalles del mensaje/i });
    const user = userEvent.setup();
    const toolTip = () => screen.findByRole('tooltip');

    return {
      link,
      triggerButton,
      user,
      toolTip,
    };
  };

  test('Should render correctly', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { link, user, toolTip } = renderComponent();

    await user.hover(link);

    expect(await toolTip()).toHaveTextContent(/detalles/i);
  });

  test('Should have a link with provided url', () => {
    const { link } = renderComponent();

    expect(link).toHaveAttribute('href', `/admin/mensajes/${messageId}`);
  });
});
