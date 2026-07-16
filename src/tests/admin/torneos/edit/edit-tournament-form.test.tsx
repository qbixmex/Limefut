import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditTournamentForm } from '@/app/admin/torneos/editar/[id]/edit-tournament-form';
import { useEditTournament } from '@/app/admin/torneos/editar/[id]/use-edit-tournament';
import { mockTournament } from './mocks/tournament';

vi.mock('@/app/admin/torneos/editar/[id]/use-edit-tournament');
vi.mock('@/app/admin/torneos/(components)/form-fields', () => ({
  FormFields: ({ categorySlot }: { categorySlot: ReactNode }) => (
    <div data-testid="form-fields">
      FormFields Mock
      {categorySlot}
    </div>
  ),
}));

const defaultProps = {
  authenticatedUserId: '7589cfc5-2f26-4a5f-91b3-91fac387ae16',
  authenticatedUserRoles: ['user', 'admin'],
  tournament: mockTournament,
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

describe('Test on <EditTournamentForm />', () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(useEditTournament).mockReturnValue(defaultMockReturn as any);
  });

  test('Should render correctly', () => {
    render(<EditTournamentForm {...defaultProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    const formFields = screen.getByTestId('form-fields');

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(formFields).toBeInTheDocument();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditTournament).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(<EditTournamentForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useEditTournament).mockReturnValue({
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

    const { rerender } = render(<EditTournamentForm {...defaultProps} />);

    const user = userEvent.setup();
    const saveBtn = screen.getByRole('button', { name: /guardar/i });
    await user.click(saveBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useEditTournament).mockReturnValue({
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
    rerender(<EditTournamentForm {...defaultProps} />);

    expect(screen.getByRole('status', { name: /enviando/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar/i })).toBeDisabled();
  });
});
