import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditCoachForm } from '@/app/admin/entrenadores/editar/[id]/edit-coach-form';
import { useEditCoach } from '@/app/admin/entrenadores/editar/[id]/use-edit-coach';
import { coachProfileMock } from '../mocks/coach-profile.mock';

vi.mock('@/app/admin/entrenadores/editar/[id]/use-edit-coach');

vi.mock('@/app/admin/entrenadores/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  coach: coachProfileMock,
};

const defaultMockReturn = {
  route: { back: vi.fn() },
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
};

describe('Test on <EditCoachForm />', () => {
  beforeEach(() => {
    vi.mocked(useEditCoach).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(<EditCoachForm {...defaultProps} />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /actualizar/i });

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('Should call route.back when cancel is clicked', async () => {
    const mockBack = vi.fn();
    vi.mocked(useEditCoach).mockReturnValue({
      ...defaultMockReturn,
      route: { back: mockBack },
    } as never);

    render(<EditCoachForm {...defaultProps} />);

    const user = userEvent.setup();
    const backButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditCoach).mockReturnValue({
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

    render(<EditCoachForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useEditCoach).mockReturnValue({
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

    const { rerender } = render(<EditCoachForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useEditCoach).mockReturnValue({
      ...defaultMockReturn,
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
      onSubmit: mockOnSubmit,
    } as never);
    rerender(<EditCoachForm {...defaultProps} />);

    await waitFor(() => {
      const submitButtonWithLoader = screen.getByRole('button', { name: /espere/i });

      const waitText = screen.getByText(/espere/i);

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByRole('button', { name: /^actualizar$/i });

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
