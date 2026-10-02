import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { mockCategory } from './mocks/category.mock';
import { useEditCategory } from '@/app/admin/categorias/editar/[id]/use-edit-category';
import { EditCategoryForm } from '@/app/admin/categorias/editar/[id]/edit-category-form';

vi.mock('@/app/admin/categorias/editar/[id]/use-edit-category.ts');

vi.mock('@/app/admin/categorias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  category: mockCategory,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <EditCategoryForm />', () => {
  beforeEach(() => {
    vi.mocked(useEditCategory).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = (props = defaultProps) => {
    render(<EditCategoryForm {...props} />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /actualizar/i });

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
    vi.mocked(useEditCategory).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditCategory).mockReturnValue({
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

    vi.mocked(useEditCategory).mockReturnValue({
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

    const { rerender } = render(<EditCategoryForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useEditCategory).mockReturnValue({
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
    rerender(<EditCategoryForm {...defaultProps} />);

    expect(screen.getByRole('button', { name: /espere/i })).toBeDisabled();
  });
});
