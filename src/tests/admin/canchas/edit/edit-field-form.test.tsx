import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditFieldForm } from '@/app/admin/canchas/editar/[id]/edit-field-form';
import { useEditField } from '@/app/admin/canchas/editar/[id]/use-edit-field';
import { fieldMock } from '../mocks/field.mock';

vi.mock('@/app/admin/canchas/editar/[id]/use-edit-field');

vi.mock('@/app/admin/canchas/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  field: fieldMock,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <EditFieldForm />', () => {
  beforeEach(() => {
    vi.mocked(useEditField).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(<EditFieldForm {...defaultProps} />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /guardar cancha/i });

    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditField).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<EditFieldForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditField).mockReturnValue({
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

    render(<EditFieldForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /guardar cancha/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useEditField).mockReturnValue({
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

    const { rerender } = render(<EditFieldForm {...defaultProps} />);

    vi.mocked(useEditField).mockReturnValue({
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
    rerender(<EditFieldForm {...defaultProps} />);

    await waitFor(() => {
      const waitText = screen.getByText(/espere/i);
      const submitButtonWithLoader = screen.getByRole('button', { name: /guardar cancha/i });

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByText(/^actualizar$/i);

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
