import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { UpdateMatchScore } from '@/app/admin/encuentros/(components)/form-fields/update-match-score';
import { matchForEditMock, MATCH_ID } from '../mocks/match-for-edit.mock';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockUpdateScoreAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateScoreAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/app/admin/encuentros/(actions)/update-match-score.action', () => ({
  updateMatchScoreAction: (props: unknown) => mockUpdateScoreAction(props),
}));

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({ defaultValues: { localScore: 2, visitorScore: 1 } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

describe('Test on <UpdateMatchScore />', () => {
  const setHiddenScores = vi.fn();

  const renderComponent = () => {
    render(
      <TestWrapper>
        <UpdateMatchScore
          match={matchForEditMock}
          setHiddenScores={setHiddenScores}
        />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const trigger = () => screen.getByRole('button', { name: /actualizar marcador/i });
    const confirm = () => screen.getByRole('button', { name: /proceder/i });
    const cancel = () => screen.getByRole('button', { name: /cancelar/i });

    return { user, trigger, confirm, cancel };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateScoreAction.mockResolvedValue({
      ok: true,
      message: 'El marcador del partido se actualizó correctamente',
      currentMatch: {
        tournament: { permalink: 'liga-mx' },
        category: { permalink: 'sub-15' },
      },
    });
  });

  test('Should render the trigger button', () => {
    const { trigger } = renderComponent();

    expect(trigger()).toBeInTheDocument();
  });

  test('Should call the action with the form scores on confirm', async () => {
    const { user, trigger, confirm } = renderComponent();

    await user.click(trigger());
    await user.click(confirm());

    await waitFor(() => {
      expect(mockUpdateScoreAction).toHaveBeenCalledWith({
        matchId: MATCH_ID,
        localScore: 2,
        visitorScore: 1,
        localId: matchForEditMock.localTeam.id,
        visitorId: matchForEditMock.visitorTeam.id,
      });
    });
  });

  test('Should hide the scores, show a success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { user, trigger, confirm } = renderComponent();

    await user.click(trigger());
    await user.click(confirm());

    await waitFor(() => {
      expect(setHiddenScores).toHaveBeenCalledWith(true);
    });
    expect(toast.success).toHaveBeenCalledWith(
      'El marcador del partido se actualizó correctamente',
    );
    expect(mockReplace).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?tournament=liga-mx' +
      '&category=sub-15' +
      '&sort-week=12',
    );
  });

  test('Should show an error toast and not navigate when the action fails', async () => {
    mockUpdateScoreAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo actualizar el partido',
      currentMatch: null,
    });
    const { toast } = await import('sonner');
    const { user, trigger, confirm } = renderComponent();

    await user.click(trigger());
    await user.click(confirm());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar el partido');
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('Should not call the action when cancel is clicked', async () => {
    const { user, trigger, cancel } = renderComponent();

    await user.click(trigger());
    await user.click(cancel());

    expect(mockUpdateScoreAction).not.toHaveBeenCalled();
  });
});
