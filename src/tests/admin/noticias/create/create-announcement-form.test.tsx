import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateAnnouncementForm } from '@/app/admin/noticias/crear/create-announcement.form';
import { useCreateAnnouncement } from '@/app/admin/noticias/crear/use-create-announcement';

vi.mock('@/app/admin/noticias/crear/use-create-announcement');

vi.mock('@/app/admin/noticias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleRedirectBack: vi.fn(),
};

describe('Test on <CreateAnnouncementForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateAnnouncement).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(<CreateAnnouncementForm />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const form = screen.getByRole('form', { name: /formulario para crear noticias/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /crear noticia/i });

    return { user, formFields, form, cancelButton, submitButton };
  };

  test('Should render correctly', () => {
    const { formFields, form, cancelButton, submitButton } = renderComponent();

    expect(formFields).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toBeDisabled();
  });

  test('Should call handleRedirectBack when cancel is clicked', async () => {
    const mockHandleRedirectBack = vi.fn();
    vi.mocked(useCreateAnnouncement).mockReturnValue({
      ...defaultMockReturn,
      handleRedirectBack: mockHandleRedirectBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleRedirectBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateAnnouncement).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
      handleRedirectBack: vi.fn(),
    } as never);

    const { user, submitButton } = renderComponent();
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    vi.mocked(useCreateAnnouncement).mockReturnValue({
      ...defaultMockReturn,
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: true },
      },
    } as never);

    renderComponent();

    await waitFor(() => {
      const waitText = screen.getByText(/guardando/i);
      const submitButton = screen.getByRole('button', { name: /crear noticia/i });
      const icon = screen.getByRole('img', { name: /icono de carga/i });

      expect(waitText).toBeInTheDocument();
      expect(icon).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });
});
