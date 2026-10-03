import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditPlayoffsMatchForm } from '@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/edit-playoff-match-form';
import { useEditPlayoffsMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/use-edit-playoffs-match';
import { PLAYOFF_ID, playoffMatchForEditMock } from '../mocks/playoff-match-for-edit.mock';

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/editar/[match_id]/use-edit-playoffs-match');

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-goals', () => ({
  LocalAndVisitorGoals: () => <div data-testid="local-and-visitor-goals" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/referee-input-field', () => ({
  RefereeInputField: () => <div data-testid="referee-input-field" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/remarks-textarea-field', () => ({
  RemarksTextAreaField: () => <div data-testid="remarks-textarea-field" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/match-date-time', () => ({
  MatchDateTime: () => <div data-testid="match-date-time" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/group-radio-select', () => ({
  GroupRadioSelect: () => <div data-testid="group-radio-select" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/match-status-select-field', () => ({
  MatchStatusSelectField: () => <div data-testid="match-status-select-field" />,
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/round-select-field', () => ({
  RoundSelectField: () => <div data-testid="round-select-field" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <EditPlayoffsMatchForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditPlayoffsMatch).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    return render(
      <EditPlayoffsMatchForm
        playoffId={PLAYOFF_ID}
        match={playoffMatchForEditMock}
        teamsSlot={<span data-testid="teams-slot" />}
        fieldsSlot={<span data-testid="fields-slot" />}
      />,
    );
  };

  test('Should render the slots and fields', () => {
    renderComponent();

    expect(screen.getByTestId('teams-slot')).toBeInTheDocument();
    expect(screen.getByTestId('fields-slot')).toBeInTheDocument();
    expect(screen.getByTestId('local-and-visitor-goals')).toBeInTheDocument();
    expect(screen.getByTestId('referee-input-field')).toBeInTheDocument();
    expect(screen.getByTestId('remarks-textarea-field')).toBeInTheDocument();
    expect(screen.getByTestId('match-date-time')).toBeInTheDocument();
    expect(screen.getByTestId('group-radio-select')).toBeInTheDocument();
    expect(screen.getByTestId('round-select-field')).toBeInTheDocument();
    expect(screen.getByTestId('match-status-select-field')).toBeInTheDocument();
  });

  test('Should pass the playoff id and match to the hook', () => {
    renderComponent();

    expect(vi.mocked(useEditPlayoffsMatch)).toHaveBeenCalledWith({
      playoffId: PLAYOFF_ID,
      match: playoffMatchForEditMock,
    });
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditPlayoffsMatch).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    renderComponent();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditPlayoffsMatch).mockReturnValue({
      ...defaultMockReturn,
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
    } as never);

    renderComponent();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /guardar/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show the loading state while submitting', async () => {
    vi.mocked(useEditPlayoffsMatch).mockReturnValue({
      ...defaultMockReturn,
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
    } as never);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/espere/i)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /carga/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^guardar$/i })).not.toBeInTheDocument();
    });
  });
});
