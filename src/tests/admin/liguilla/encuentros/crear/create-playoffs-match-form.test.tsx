import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreatePlayoffsMatchForm } from '@/app/admin/liguilla/[playoff_id]/encuentros/crear/create-playoffs-match-form';
import { useCreatePlayoffsMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/crear/use-create-playoffs-match';

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/crear/use-create-playoffs-match');

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

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <CreatePlayoffsMatchForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreatePlayoffsMatch).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    return render(
      <CreatePlayoffsMatchForm
        playoffId={playoffId}
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

  test('Should render the cancel and submit buttons', () => {
    renderComponent();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const createButton = screen.getByRole('button', { name: /^crear$/i });

    expect(cancelButton).toBeInTheDocument();
    expect(createButton).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreatePlayoffsMatch).mockReturnValue({
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
    vi.mocked(useCreatePlayoffsMatch).mockReturnValue({
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
    await user.click(screen.getByRole('button', { name: /^crear$/i }));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show the loading state while submitting', async () => {
    vi.mocked(useCreatePlayoffsMatch).mockReturnValue({
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
      expect(screen.getByRole('button', { name: /espere/i })).toBeDisabled();
      expect(screen.getByRole('img', { name: /carga/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /^crear$/i })).not.toBeInTheDocument();
    });
  });
});
