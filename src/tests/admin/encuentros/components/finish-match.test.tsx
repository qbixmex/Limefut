import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinishMatch } from '@/app/admin/encuentros/(components)/finish-match';

const mockFinishAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/encuentros/(actions)/finish-match.action', () => ({
  finishMatchAction: (props: unknown) => mockFinishAction(props),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const props = {
  matchId: '0251b9bf-55e5-48fb-ae2c-6fcdad308d13',
  localScore: 2,
  visitorScore: 1,
  localId: '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675',
  visitorId: '99182b8e-143a-479b-8496-24f283e847ae',
};

describe('Test on <FinishMatch /> component', () => {
  const renderComponent = () => {
    render(<FinishMatch {...props} />);

    const user = userEvent.setup();
    const triggerButton = () => screen.getByRole('button', { name: /finalizar encuentro/i });
    const confirmButton = () => screen.getByRole('button', { name: /proceder/i });
    const cancelButton = () => screen.getByRole('button', { name: /^cancelar$/ });

    return { user, triggerButton, confirmButton, cancelButton };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFinishAction.mockResolvedValue({
      ok: true,
      message: 'El estado del partido finalizó correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton()).toBeInTheDocument();
    expect(triggerButton()).toHaveTextContent(/finalizar/i);
  });

  test('Should call finishMatchAction with the props on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockFinishAction).toHaveBeenCalledWith(props);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'El estado del partido finalizó correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockFinishAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo finalizar el partido',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo finalizar el partido');
    });
  });

  test('Should not call the action when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(cancelButton());

    expect(mockFinishAction).not.toHaveBeenCalled();
  });
});
