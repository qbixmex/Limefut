import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreatePlayoffsForm } from '@/app/admin/liguilla/crear/create-playoffs-form';
import { useCreatePlayoffs } from '@/app/admin/liguilla/crear/use-create-playoffs';

vi.mock('@/app/admin/liguilla/crear/use-create-playoffs');

vi.mock('@/app/admin/liguilla/(components)/form-fields/starting-round-field', () => ({
  StartingRoundField: () => <div data-testid="starting-round-field" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

const renderComponent = () => {
  return render(
    <CreatePlayoffsForm
      tournamentSlot={<span data-testid="tournament-slot" />}
      categorySlot={<span data-testid="category-slot" />}
      teamsSlot={<span data-testid="teams-slot" />}
    />,
  );
};

describe('Test on <CreatePlayoffsForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreatePlayoffs).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    renderComponent();

    const tournamentSlot = screen.getByTestId('tournament-slot');
    const categorySlot = screen.getByTestId('category-slot');
    const teamsSlot = screen.getByTestId('teams-slot');
    const startingRoundField = screen.getByTestId('starting-round-field');
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /crear/i });

    expect(tournamentSlot).toBeInTheDocument();
    expect(categorySlot).toBeInTheDocument();
    expect(teamsSlot).toBeInTheDocument();
    expect(startingRoundField).toBeInTheDocument();
    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreatePlayoffs).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    renderComponent();

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreatePlayoffs).mockReturnValue({
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
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    vi.mocked(useCreatePlayoffs).mockReturnValue({
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
      const waitText = screen.getByText(/espere/i);
      const submitButtonWithLoader = screen.getByRole('button', { name: /espere/i });
      const loaderIcon = screen.getByRole('status', { name: /carga/i });
      const submitButtonWithoutLoader = screen.queryByRole('button', { name: /^crear$/i });

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();
      expect(loaderIcon).toBeInTheDocument();
      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
