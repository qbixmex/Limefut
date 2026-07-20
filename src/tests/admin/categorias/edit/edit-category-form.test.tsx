import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditCategoryForm } from '@/app/admin/categorias/(components)/edit-category-form';
import { useEditCategory } from '@/app/admin/categorias/(components)/use-edit-category';
import { mockCategory } from './mocks/category.mock';

vi.mock('@/app/admin/categorias/(components)/use-edit-category');

vi.mock('@/app/admin/categorias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  authenticatedUserId: '881bf0f0-b4d4-4de1-b19e-eb9927d04d99',
  authenticatedUserRoles: ['admin'],
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

  test('Should render correctly', () => {
    render(<EditCategoryForm {...defaultProps} />);

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /actualizar/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditCategory).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<EditCategoryForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

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

    render(<EditCategoryForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /actualizar/i });
    await user.click(submitBtn);

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
