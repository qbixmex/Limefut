import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { CreateGalleryImageForm } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/create-gallery-image-form';
import { useCreateGalleryImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-create-gallery-image';

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/use-create-gallery-image');

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

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const imagesQuantity = 3;
const onSuccess = vi.fn();

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => onSubmit),
    formState: { isSubmitting: false },
  },
  onSubmit: vi.fn(),
};

describe('Test on <CreateGalleryImageForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateGalleryImage).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = () => {
    render(
      <CreateGalleryImageForm
        galleryId={galleryId}
        imagesQuantity={imagesQuantity}
        onSuccess={onSuccess}
      />,
    );

    const user = userEvent.setup();
    const form = screen.getByRole('form', {
      name: /formulario para subir imagen/i,
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

    expect(useCreateGalleryImage).toHaveBeenCalledWith({
      galleryId,
      imagesQuantity,
      onSuccess,
    });
  });

  test('Should call onSubmit when the form is submitted', async () => {
    const mockOnSubmit = vi.fn();
    vi.mocked(useCreateGalleryImage).mockReturnValue({
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
    vi.mocked(useCreateGalleryImage).mockReturnValue({
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
