import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateCategoryForm } from '@/app/admin/categorias/(components)/create-category-form';
import { useCreateCategory } from '@/app/admin/categorias/(components)/useCreateCategory';

vi.mock('@/app/admin/categorias/(components)/useCreateCategory');

vi.mock('@/app/admin/categorias/(components)/form-fields', () => ({
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

describe('Test on <CreateCategoryForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreateCategory).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(
      <CreateCategoryForm />,
    );

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    const submitBtn = screen.getByRole('button', { name: /crear/i });

    expect(cancelBtn).toBeInTheDocument();
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreateCategory).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(
      <CreateCategoryForm />,
    );

    const user = userEvent.setup();
    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelBtn);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateCategory).mockReturnValue({
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

    render(
      <CreateCategoryForm />,
    );

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateCategory).mockReturnValue({
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

    const { rerender } = render(
      <CreateCategoryForm />,
    );

    const user = userEvent.setup();
    const submitBtn = screen.getByRole('button', { name: /crear/i });
    await user.click(submitBtn);

    expect(mockOnSubmit).toHaveBeenCalled();

    vi.mocked(useCreateCategory).mockReturnValue({
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
    rerender(
      <CreateCategoryForm />,
    );

    await waitFor(() => {
      expect(screen.getByText(/espere/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /crear/i })).toBeDisabled();
    });
  });
});
