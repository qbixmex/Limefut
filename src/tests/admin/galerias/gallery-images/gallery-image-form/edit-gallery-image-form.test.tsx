import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditGalleryImageForm } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/edit-gallery-image-form';
import { useEditGalleryImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-edit-gallery-image';

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-edit-gallery-image');

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields', () => ({
  GalleryImageFormFields: () => <div data-testid="form-fields" />,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/submit-button', () => ({
  SubmitButton: ({
    isSubmitting,
    label,
  }: {
    isSubmitting: boolean;
    label: string;
  }) => (
    <button
      type="submit"
      data-testid="submit-button"
      data-submitting={String(isSubmitting)}
    >
      {label}
    </button>
  ),
}));

const galleryImage = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Imagen original',
  active: true,
  position: 2,
};
const onSuccess = vi.fn();

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
};

describe('Test on <EditGalleryImageForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEditGalleryImage).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(
      <EditGalleryImageForm
        galleryImage={galleryImage}
        onSuccess={onSuccess}
      />,
    );

    const user = userEvent.setup();
    const form = screen.getByRole('form', {
      name: /formulario para editar imagen/i,
    });
    const formFields = screen.getByTestId('form-fields');
    const submitButton = screen.getByTestId('submit-button');

    return { user, form, formFields, submitButton };
  };

  test('Should render correctly', () => {
    const { form, formFields, submitButton } = renderComponent();

    expect(form).toBeInTheDocument();
    expect(formFields).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('Should call the hook with the expected arguments', () => {
    renderComponent();

    expect(useEditGalleryImage).toHaveBeenCalledWith({
      galleryImage,
      onSuccess,
    });
  });

  test('Should call onSubmit when the form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useEditGalleryImage).mockReturnValue({
      form: {
        handleSubmit: vi.fn(
          (onSubmit: () => void) => (event: { preventDefault: () => void }) => {
            event.preventDefault();
            onSubmit();
          },
        ),
        formState: { isSubmitting: false },
      },
      onSubmit: mockOnSubmit,
    } as never);

    const { user, submitButton } = renderComponent();

    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Should pass the submitting state to the submit button', () => {
    vi.mocked(useEditGalleryImage).mockReturnValue({
      ...defaultMockReturn,
      form: {
        ...defaultMockReturn.form,
        formState: { isSubmitting: true },
      },
    } as never);

    const { submitButton } = renderComponent();

    expect(submitButton).toHaveAttribute('data-submitting', 'true');
  });
});
