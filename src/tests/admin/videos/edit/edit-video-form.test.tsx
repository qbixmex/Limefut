import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditVideoForm } from '@/app/admin/videos/editar/[id]/edit-video-form';
import { useEditVideo } from '@/app/admin/videos/editar/[id]/use-edit-video';
import { videoMock } from '../mocks/video.mock';

vi.mock('@/app/admin/videos/editar/[id]/use-edit-video');

vi.mock('@/app/admin/videos/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  handleRedirectBack: vi.fn(),
  onSubmit: vi.fn(),
};

describe('Test on <EditVideoForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditVideo).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(<EditVideoForm video={videoMock} />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const form = screen.getByRole('form', { name: /formulario para editar videos/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /guardar video/i });

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

  test('Should pass the video to useEditVideo', () => {
    renderComponent();

    expect(vi.mocked(useEditVideo)).toHaveBeenCalledWith(videoMock);
  });

  test('Should navigate to the videos list when cancel is clicked', async () => {
    const mockHandleRedirectBack = vi.fn();
    vi.mocked(useEditVideo).mockReturnValue({
      ...defaultMockReturn,
      handleRedirectBack: mockHandleRedirectBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleRedirectBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditVideo).mockReturnValue({
      form: {
        handleSubmit: vi.fn((onSubmit: () => void) => (e: { preventDefault: () => void }) => {
          e.preventDefault();
          onSubmit();
        }),
        formState: { isSubmitting: false },
      },
      route: { replace: vi.fn() },
      onSubmit: mockOnSubmit,
    } as never);

    const { user, submitButton } = renderComponent();
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should show loading state when form is submitting', async () => {
    vi.mocked(useEditVideo).mockReturnValue({
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
      expect(screen.getByText(/guardando/i)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /icono de carga/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar video/i })).toBeDisabled();
    });
  });
});
