import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditAnnouncementForm } from '@/app/admin/noticias/editar/[id]/edit-announcement.form';
import { useEditAnnouncement } from '@/app/admin/noticias/editar/[id]/use-edit-announcement';
import type { ANNOUNCEMENT_TYPE } from '@/app/admin/noticias/(actions)/fetchAnnouncementAction';

vi.mock('@/app/admin/noticias/editar/[id]/use-edit-announcement');

vi.mock('@/app/admin/noticias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const announcement: ANNOUNCEMENT_TYPE = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Noticia de Apertura',
  permalink: 'noticia-de-apertura',
  description: 'Descripción de la noticia',
  content: 'Contenido de la noticia',
  publishedDate: new Date('2026-01-15T12:00:00.000Z'),
  imageUrl: null,
  active: true,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleRedirectBack: vi.fn(),
};

describe('Test on <EditAnnouncementForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditAnnouncement).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(<EditAnnouncementForm announcement={announcement} />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const form = screen.getByRole('form', { name: /formulario para editar noticias/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /guardar noticia/i });

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

  test('Should pass the announcement to useEditAnnouncement', () => {
    renderComponent();

    expect(vi.mocked(useEditAnnouncement)).toHaveBeenCalledWith({ announcement });
  });

  test('Should call handleRedirectBack when cancel is clicked', async () => {
    const mockHandleRedirectBack = vi.fn();
    vi.mocked(useEditAnnouncement).mockReturnValue({
      ...defaultMockReturn,
      handleRedirectBack: mockHandleRedirectBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleRedirectBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditAnnouncement).mockReturnValue({
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
    vi.mocked(useEditAnnouncement).mockReturnValue({
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
      expect(screen.getByRole('button', { name: /guardar noticia/i })).toBeDisabled();
    });
  });
});
