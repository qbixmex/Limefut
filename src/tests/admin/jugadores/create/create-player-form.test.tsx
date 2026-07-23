import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreatePlayerForm } from '@/app/admin/jugadores/(components)/create-player-form';
import { useCreatePlayer } from '@/app/admin/jugadores/(components)/use-create-player';

vi.mock('@/app/admin/jugadores/(components)/use-create-player');

vi.mock('@/app/admin/jugadores/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  authenticatedUserId: '2d5d6c9f-8a7b-4e3c-9f1d-6e8a7b4c3f2d',
  authenticatedUserRoles: ['admin'],
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

  test('Should render correctly', () => {
    render(<CreatePlayerForm {...defaultProps} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /crear/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreatePlayer).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<CreatePlayerForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

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

    render(<CreatePlayerForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

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
