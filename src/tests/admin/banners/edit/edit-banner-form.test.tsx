import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditBannerForm } from '@/app/admin/banners/editar/[id]/edit-banner-form';
import { useEditBanner } from '@/app/admin/banners/editar/[id]/use-edit-banner';
import { heroBannerMock } from '../mocks/hero-banner.mock';

vi.mock('@/app/admin/banners/editar/[id]/use-edit-banner');

vi.mock('@/app/admin/banners/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultProps = {
  heroBanner: heroBannerMock,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <EditBannerForm />', () => {
  beforeEach(() => {
    vi.mocked(useEditBanner).mockReturnValue(defaultMockReturn as never);
  });

  test('Should render form correctly', () => {
    render(<EditBannerForm {...defaultProps} />);
    const form = screen.getByRole('form', { name: /formulario para editar/i });
    expect(form).toBeInTheDocument();
  });

  test('Should render form fields correctly', () => {
    render(<EditBannerForm {...defaultProps} />);
    const formFields = screen.getByTestId('form-fields');
    expect(formFields).toBeInTheDocument();
  });

  test('Should render cancel button correctly', () => {
    render(<EditBannerForm {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    expect(cancelButton).toBeInTheDocument();
  });

  test('Should render submit button correctly', () => {
    render(<EditBannerForm {...defaultProps} />);
    const submitButton = screen.getByRole('button', { name: /guardar banner/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditBanner).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    render(<EditBannerForm {...defaultProps} />);

    const user = userEvent.setup();
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditBanner).mockReturnValue({
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

    render(<EditBannerForm {...defaultProps} />);

    const user = userEvent.setup();
    const submitButton = screen.getByRole('button', { name: /guardar banner/i });
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    const mockOnSubmit = vi.fn();

    vi.mocked(useEditBanner).mockReturnValue({
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

    const { rerender } = render(<EditBannerForm {...defaultProps} />);

    vi.mocked(useEditBanner).mockReturnValue({
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
    rerender(<EditBannerForm {...defaultProps} />);

    await waitFor(() => {
      const waitText = screen.getByText(/espere/i);
      const submitButtonWithLoader = screen.getByRole('button', { name: /guardar banner/i });

      expect(waitText).toBeInTheDocument();
      expect(submitButtonWithLoader).toBeDisabled();

      const submitButtonWithoutLoader = screen.queryByText(/^actualizar$/i);

      expect(submitButtonWithoutLoader).not.toBeInTheDocument();
    });
  });
});
