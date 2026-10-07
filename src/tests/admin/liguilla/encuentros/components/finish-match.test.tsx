import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FinishMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/finish-match';

const mockFinishAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/finish-playoff-match.action', () => ({
  finishPlayoffMatchAction: (props: unknown) => mockFinishAction(props),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const props = {
  matchId: '24620ff5-cd48-4385-9ab8-b6320d69947f',
  localScore: 2,
  visitorScore: 1,
  localId: '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  visitorId: '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
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

  test('Should call finishPlayoffMatchAction with the props on confirm', async () => {
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
