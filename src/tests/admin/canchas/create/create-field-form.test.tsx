import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateFieldForm } from '@/app/admin/canchas/crear/create-field-form';
import { useCreateField } from '@/app/admin/canchas/crear/use-create-field';

vi.mock('@/app/admin/canchas/crear/use-create-field');

vi.mock('@/app/admin/canchas/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <CreateFieldForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreateField).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(<CreateFieldForm />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /crear cancha/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreateField).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<CreateFieldForm />);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateField).mockReturnValue({
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

    render(<CreateFieldForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /crear cancha/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateField).mockReturnValue({
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

    const { rerender } = render(<CreateFieldForm />);

    vi.mocked(useCreateField).mockReturnValue({
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
    rerender(<CreateFieldForm />);

    await waitFor(() => {
      const waitText = screen.getByText(/espere/i);
      const submitButtonWithLoader = screen.getByRole('button', { name: /crear cancha/i });

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByText(/^crear$/i);

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
