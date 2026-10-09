import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { EditCustomPageForm } from '@/app/admin/paginas/editar/[id]/edit-custom-page-form';
import { useEditCustomPage } from '@/app/admin/paginas/editar/[id]/use-edit-custom-page';
import { customPageMock } from '../mocks/custom-page.mock';

vi.mock('@/app/admin/paginas/editar/[id]/use-edit-custom-page');

vi.mock('@/app/admin/paginas/(components)/form-fields', () => ({
  FormFields: () => <div data-testid="form-fields" />,
}));

let contentImagesProps: Record<string, unknown> | undefined;

vi.mock('@/app/admin/paginas/(components)/content-images', () => ({
  ContentImages: (props: Record<string, unknown>) => {
    contentImagesProps = props;
    return <div data-testid="content-images" />;
  },
}));

const defaultProps = {
  customPage: customPageMock,
};

const defaultMockReturn = {
  form: {
    handleSubmit: vi.fn((onSubmit: () => void) => (event: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      onSubmit();
    }),
    formState: { isSubmitting: false },
  },
  handleNavigateBack: vi.fn(),
  onSaveDraft: vi.fn(),
  isDraft: false,
  onSubmit: vi.fn(),
  updateContentImage: vi.fn(),
  contentImages: customPageMock.images,
  removeContentImage: vi.fn(),
};

describe('Test on <EditCustomPageForm />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    contentImagesProps = undefined;
    vi.mocked(useEditCustomPage).mockReturnValue(defaultMockReturn as never);
  });

  const renderComponent = (props = defaultProps) => {
    render(<EditCustomPageForm {...props} />);

    const user = userEvent.setup();

    return { user };
  };

  test('Should render the form fields, content images and buttons', () => {
    renderComponent();

    expect(screen.getByTestId('form-fields')).toBeInTheDocument();
    expect(screen.getByTestId('content-images')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^guardar$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar y cerrar/i })).toBeInTheDocument();
  });

  test('Should pass the local images and remover to <ContentImages />', () => {
    renderComponent();

    expect(contentImagesProps).toEqual(
      expect.objectContaining({
        pageId: customPageMock.id,
        contentImages: customPageMock.images,
        onImageDeleted: defaultMockReturn.removeContentImage,
      }),
    );
  });

  test('Should navigate to the list when cancel is clicked', async () => {
    const { user } = renderComponent();

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });

    await user.click(cancelButton);

    expect(defaultMockReturn.handleNavigateBack).toHaveBeenCalled();
  });

  test('Should call onSubmit when the form is submitted', async () => {
    const { user } = renderComponent();

    const submitButton = screen.getByRole('button', { name: /^guardar$/i });

    await user.click(submitButton);

    expect(defaultMockReturn.onSubmit).toHaveBeenCalled();
  });

  test('Should show the draft loading state while submitting as draft', () => {
    vi.mocked(useEditCustomPage).mockReturnValue({
      ...defaultMockReturn,
      isDraft: true,
      form: {
        handleSubmit: defaultMockReturn.form.handleSubmit,
        formState: { isSubmitting: true },
      },
    } as never);

    renderComponent();

    const status = screen.getByRole('status');
    const icon = screen.getByRole('img', { name: /icono de carga/i });

    expect(status).toHaveTextContent(/guardando/i);
    expect(icon).toBeInTheDocument();
  });

  test('Should show the publishing loading state while submitting to close', () => {
    vi.mocked(useEditCustomPage).mockReturnValue({
      ...defaultMockReturn,
      isDraft: false,
      form: {
        handleSubmit: defaultMockReturn.form.handleSubmit,
        formState: { isSubmitting: true },
      },
    } as never);

    renderComponent();

    const status = screen.getByRole('status', { name: /estado del formulario/i });
    const icon = screen.getByRole('img', { name: /icono de carga/i });

    expect(status).toHaveTextContent(/publicando/i);
    expect(icon).toBeInTheDocument();
  });
});
