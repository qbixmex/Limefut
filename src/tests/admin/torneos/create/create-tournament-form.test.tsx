import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateTournamentForm } from '@/app/admin/torneos/crear/create-tournament-form';
import { useCreateTournament } from '@/app/admin/torneos/crear/use-create-tournament';

vi.mock('@/app/admin/torneos/crear/use-create-tournament');
vi.mock('@/app/admin/torneos/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields">FormFields Mock</div>,
}));

const defaultProps = {
  authenticatedUserId: '7589cfc5-2f26-4a5f-91b3-91fac387ae16',
  authenticatedUserRoles: ['user', 'admin'],
  categorySlot: null,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <CreateTournamentForm />', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useCreateTournament).mockReturnValue(defaultMockReturn as any);
  });

  test('Should render correctly', () => {
    render(<CreateTournamentForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /crear/i });
    const formFields = screen.getByTestId('form-fields');

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(formFields).toBeInTheDocument();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreateTournament).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<CreateTournamentForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateTournament).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: React.SubmitEvent) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    const { rerender } = render(<CreateTournamentForm {...defaultProps} />);

    const user = userEvent.setup();
    const createBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(createBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useCreateTournament).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: React.SubmitEvent) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
      onSubmit: mockOnSubmit,
      handleNavigateBack: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    rerender(<CreateTournamentForm {...defaultProps} />);

    expect(screen.getByRole('status', { name: /enviando/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear/i })).toBeDisabled();
  });
});
