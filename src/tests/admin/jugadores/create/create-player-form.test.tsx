import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreatePlayerForm } from '@/app/admin/jugadores/(components)/create-player-form';
import { useCreatePlayer } from '@/app/admin/jugadores/(components)/use-create-player';

vi.mock('@/app/admin/jugadores/(components)/use-create-player');

vi.mock('@/app/admin/jugadores/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  teams: [{ id: 'b3f2d1e4-5a6c-7b8d-9e0f-1a2b3c4d5e6f', name: 'Team A' }],
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <CreatePlayerForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreatePlayer).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = (props = defaultProps) => {
    render(<CreatePlayerForm {...props} />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /crear/i });

    return { user, formFields, cancelButton, submitButton };
  };

  test('Should render correctly', () => {
    const { formFields, cancelButton, submitButton } = renderComponent();

    expect(formFields).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreatePlayer).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreatePlayer).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);

    const { user, submitButton } = renderComponent();
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreatePlayer).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);

    const { rerender } = render(<CreatePlayerForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useCreatePlayer).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    } as never);
    rerender(<CreatePlayerForm {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByRole('status', { name: /enviando/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear/i })).toBeDisabled();
    });
  });
});
