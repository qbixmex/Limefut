import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditGalleryForm } from '@/app/admin/galerias/editar/[id]/edit-gallery-form';
import { useEditGallery } from '@/app/admin/galerias/editar/[id]/use-edit-gallery';
import type { Gallery } from '@/shared/interfaces';

vi.mock('@/app/admin/galerias/editar/[id]/use-edit-gallery');

vi.mock('@/app/admin/galerias/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

const gallery: Gallery = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Galería de Apertura',
  permalink: 'galeria-de-apertura',
  galleryDate: new Date('2026-01-15T12:00:00.000Z'),
  active: true,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
  handleNavigateBack: vi.fn(),
};

describe('Test on <EditGalleryForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditGallery).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(<EditGalleryForm gallery={gallery} />);

    const user = userEvent.setup();
    const formFields = screen.getByTestId('form-fields');
    const form = screen.getByRole('form', { name: /formulario para editar galerías/i });
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    const submitButton = screen.getByRole('button', { name: /guardar galería/i });

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

  test('Should pass the gallery to useEditGallery', () => {
    renderComponent();

    expect(vi.mocked(useEditGallery)).toHaveBeenCalledWith({ gallery });
  });

  test('Should call handleNavigateBack when cancel is clicked', async () => {
    const mockHandleNavigateBack = vi.fn();
    vi.mocked(useEditGallery).mockReturnValue({
      ...defaultMockReturn,
      handleNavigateBack: mockHandleNavigateBack,
    } as never);

    const { user, cancelButton } = renderComponent();
    await user.click(cancelButton);

    expect(mockHandleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when submit is clicked', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditGallery).mockReturnValue({
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
    vi.mocked(useEditGallery).mockReturnValue({
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
      expect(screen.getByText(/espere/i)).toBeInTheDocument();
      expect(screen.getByRole('img', { name: /icono de carga/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /guardar galería/i })).toBeDisabled();
    });
  });
});
