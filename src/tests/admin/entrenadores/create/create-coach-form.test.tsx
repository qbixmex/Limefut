import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateCoachForm } from '@/app/admin/entrenadores/crear/create-coach-form';
import { useCreateCoach } from '@/app/admin/entrenadores/crear/use-create-coach';

vi.mock('@/app/admin/entrenadores/crear/use-create-coach');

vi.mock('@/app/admin/entrenadores/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultMockReturn = {
  route: { back: vi.fn() },
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
};

describe('Test on <CreateCoachForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreateCoach).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(<CreateCoachForm />);

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

  test('Should call route.back when cancel is clicked', async () => {
    const mockBack = vi.fn();
    vi.mocked(useCreateCoach).mockReturnValue({
      ...defaultMockReturn,
      route: { back: mockBack },
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateCoach).mockReturnValue({
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

    const { user, submitButton } = renderComponent();
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateCoach).mockReturnValue({
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

    const { rerender } = render(<CreateCoachForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /crear/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useCreateCoach).mockReturnValue({
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
    rerender(<CreateCoachForm />);

    await waitFor(() => {
      const submitButtonWithLoader = screen.getByRole('button', { name: /espere/i });

      const waitText = screen.getByText(/espere/i);

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByRole('button', { name: /^crear$/i });

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
