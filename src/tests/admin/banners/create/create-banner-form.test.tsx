import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateBannerForm } from '@/app/admin/banners/crear/create-banner-form';
import { useCreateBanner } from '@/app/admin/banners/crear/use-create-banner';

vi.mock('@/app/admin/banners/crear/use-create-banner');

vi.mock('@/app/admin/banners/(components)/form-fields', () => ({
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

describe('Test on <CreateBannerForm />', () => {
  beforeEach(() => {
    vi.mocked(useCreateBanner).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render correctly', () => {
    render(<CreateBannerForm />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const form = screen.getByRole('form', { name: /formulario/i });

    expect(form).toBeInTheDocument();
  });

  test('Should render cancel button', () => {
    render(<CreateBannerForm />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /cancelar/i });

    expect(cancelBtn).toBeInTheDocument();
  });

  test('Should render submit button', () => {
    render(<CreateBannerForm />);

    const formFields = screen.getByTestId('form-fields');

    expect(formFields).toBeInTheDocument();

    const submitBtn = screen.getByRole('button', { name: /crear banner/i });

    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useCreateBanner).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<CreateBannerForm />);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateBanner).mockReturnValue({
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

    render(<CreateBannerForm />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /crear banner/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useCreateBanner).mockReturnValue({
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

    const { rerender } = render(<CreateBannerForm />);

    vi.mocked(useCreateBanner).mockReturnValue({
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
    rerender(<CreateBannerForm />);

    await waitFor(() => {
      const waitText = screen.getByText(/espere/i);
      const submitButtonWithLoader = screen.getByRole('button', { name: /crear banner/i });

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByText(/^crear$/i);

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
