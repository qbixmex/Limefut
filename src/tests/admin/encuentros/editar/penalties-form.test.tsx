import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PenaltiesForm } from '@/app/admin/encuentros/editar/[id]/components/penalties-form';

const mockCreateAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/encuentros/(actions)/create-regular-penalty-shootouts.action', () => ({
  createRegularPenaltyShootoutAction: (formData: unknown) => mockCreateAction(formData),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const currentMatchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

const localTeam = {
  id: '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675',
  name: 'América',
  players: [
    { id: '49b70abe-9944-4a33-94a9-b12cb0003719', name: 'Luis García' },
    { id: '6944f902-618a-498b-880d-86f70ad534c2', name: 'Carlos Ruiz' },
  ],
};

const visitorTeam = {
  id: '99182b8e-143a-479b-8496-24f283e847ae',
  name: 'Chivas',
  players: [
    { id: '19a2d573-6bd4-41ec-b8be-507456e67400', name: 'Diego López' },
  ],
};

describe('Test on <PenaltiesForm />', () => {
  const renderComponent = () => {
    render(
      <PenaltiesForm
        currentMatchId={currentMatchId}
        localTeam={localTeam}
        visitorTeam={visitorTeam}
      />,
    );

    const user = userEvent.setup();
    const comboboxes = () => screen.getAllByRole('combobox');
    const submit = () => screen.getByRole('button', { name: /guardar/i });

    return { user, comboboxes, submit };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Tanda de penales creada correctamente',
    });
  });

  test('Should render the shooter and result selects', () => {
    const { comboboxes } = renderComponent();

    expect(screen.getByText(/tirador local/i)).toBeInTheDocument();
    expect(screen.getByText(/tirador visitante/i)).toBeInTheDocument();
    expect(screen.getAllByText(/resultado/i)).toHaveLength(2);
    expect(comboboxes()).toHaveLength(4);
  });

  test('Should not call the action when the form is empty', async () => {
    const { user, submit } = renderComponent();

    await user.click(submit());

    expect(mockCreateAction).not.toHaveBeenCalled();
  });

  test('Should call the action with the shooters and results', async () => {
    const { user, comboboxes, submit } = renderComponent();

    await user.click(comboboxes()[0]);
    await user.click(await screen.findByRole('option', { name: 'Luis García' }));

    await user.click(comboboxes()[1]);
    await user.click(await screen.findByRole('option', { name: 'Anotado' }));

    await user.click(comboboxes()[2]);
    await user.click(await screen.findByRole('option', { name: 'Diego López' }));

    await user.click(comboboxes()[3]);
    await user.click(await screen.findByRole('option', { name: 'Fallado' }));

    await user.click(submit());

    await waitFor(() => {
      expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));
    });

    const formData = mockCreateAction.mock.calls[0][0] as FormData;
    expect(formData.get('matchId')).toBe(currentMatchId);
    expect(formData.get('localTeamId')).toBe(localTeam.id);
    expect(formData.get('visitorTeamId')).toBe(visitorTeam.id);
    expect(formData.get('localPlayerName')).toBe('Luis García');
    expect(formData.get('visitorPlayerName')).toBe('Diego López');
    expect(formData.get('localIsGoal')).toBe('scored');
    expect(formData.get('visitorIsGoal')).toBe('missed');
  });

  test('Should show a success toast on success', async () => {
    const { toast } = await import('sonner');
    const { user, comboboxes, submit } = renderComponent();

    await user.click(comboboxes()[0]);
    await user.click(await screen.findByRole('option', { name: 'Luis García' }));
    await user.click(comboboxes()[1]);
    await user.click(await screen.findByRole('option', { name: 'Anotado' }));
    await user.click(comboboxes()[2]);
    await user.click(await screen.findByRole('option', { name: 'Diego López' }));
    await user.click(comboboxes()[3]);
    await user.click(await screen.findByRole('option', { name: 'Fallado' }));
    await user.click(submit());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Tanda de penales creada correctamente',
      );
    });
  });

  test('Should reset the form to its default values after a successful submit', async () => {
    const { user, comboboxes, submit } = renderComponent();

    await user.click(comboboxes()[0]);
    await user.click(await screen.findByRole('option', { name: 'Luis García' }));
    await user.click(comboboxes()[1]);
    await user.click(await screen.findByRole('option', { name: 'Anotado' }));
    await user.click(comboboxes()[2]);
    await user.click(await screen.findByRole('option', { name: 'Diego López' }));
    await user.click(comboboxes()[3]);
    await user.click(await screen.findByRole('option', { name: 'Fallado' }));

    // The selections are reflected before submitting
    await waitFor(() => {
      expect(comboboxes()[0]).toHaveTextContent('Luis García');
    });
    expect(comboboxes()[1]).toHaveTextContent('Anotado');
    expect(comboboxes()[2]).toHaveTextContent('Diego López');
    expect(comboboxes()[3]).toHaveTextContent('Fallado');

    await user.click(submit());

    // After a successful submit the form is cleared back to createFormDefaultValues()
    await waitFor(() => {
      expect(mockCreateAction).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(comboboxes()[0]).toHaveTextContent('Seleccione Jugador');
    });
    expect(comboboxes()[1]).toHaveTextContent('Seleccione una opción');
    expect(comboboxes()[2]).toHaveTextContent('Seleccione Jugador');
    expect(comboboxes()[3]).toHaveTextContent('Seleccione una opción');
  });

  test('Should show an error toast when the action fails', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear la tanda de penales',
    });
    const { toast } = await import('sonner');
    const { user, comboboxes, submit } = renderComponent();

    await user.click(comboboxes()[0]);
    await user.click(await screen.findByRole('option', { name: 'Luis García' }));
    await user.click(comboboxes()[1]);
    await user.click(await screen.findByRole('option', { name: 'Anotado' }));
    await user.click(comboboxes()[2]);
    await user.click(await screen.findByRole('option', { name: 'Diego López' }));
    await user.click(comboboxes()[3]);
    await user.click(await screen.findByRole('option', { name: 'Fallado' }));
    await user.click(submit());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al crear la tanda de penales');
    });
  });
});
