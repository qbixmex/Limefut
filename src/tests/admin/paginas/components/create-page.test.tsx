import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { CreatePage } from '@/app/admin/paginas/(components)/create-page';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateEmptyCustomPage } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateEmptyCustomPage: vi.fn<
    () => Promise<{ ok: boolean; message: string; pageId: string | null }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/paginas/(actions)/createEmptyCustomPage', () => ({
  createEmptyCustomPage: mockCreateEmptyCustomPage,
}));

describe('Test on <CreatePage /> component', () => {
  const testId = 'd66aeeff-2ac9-4eb6-b280-94675d0a4437';
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateEmptyCustomPage.mockResolvedValue({
      ok: true,
      message: 'Borrador creado correctamente',
      pageId: testId,
    });
  });

  const renderComponent = () => {
    render(<CreatePage />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const button = screen.getByRole('button', { name: /crear borrador/i });

    return { user, button };
  };

  test('Should render correctly', () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show tooltip on mouse over', async () => {
    const { user, button } = renderComponent();

    await user.hover(button);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(/crear borrador/i);
  });

  test('Should create an empty page and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { user, button } = renderComponent();

    await user.click(button);

    await waitFor(() => {
      expect(mockCreateEmptyCustomPage).toHaveBeenCalled();
    });
    expect(toast.success).toHaveBeenCalledWith('Borrador creado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CUSTOM_PAGES_EDIT(testId));
  });

  test('Should show error toast and not navigate on failure', async () => {
    mockCreateEmptyCustomPage.mockResolvedValue({
      ok: false,
      message: 'No se pudo crear el borrador',
      pageId: null,
    });
    const { toast } = await import('sonner');
    const { user, button } = renderComponent();

    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo crear el borrador');
    });
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
