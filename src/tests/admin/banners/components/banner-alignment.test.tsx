import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BannerAlignment } from '@/app/admin/banners/(components)/banner-alignment';

const mockUpdateAlignmentAction = vi.fn<
  (
    bannerId: string,
    newAlignment: string,
  ) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/banners/(actions)', () => ({
  updateHeroBannerAlignmentAction: (bannerId: string, newAlignment: string) =>
    mockUpdateAlignmentAction(bannerId, newAlignment),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const bannerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <BannerAlignment /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAlignmentAction.mockResolvedValue({
      ok: true,
      message: 'Se actualizó la alineación correctamente',
    });
  });

  const renderComponent = (
    initialPosition: 'left' | 'center' | 'right',
    selectPosition?: 'izquierda' | 'centro' | 'derecha',
  ) => {
    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={initialPosition}
      />,
    );

    const user = userEvent.setup();
    const selectField = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });
    const selectItem = () => screen.getByRole('option', { name: selectPosition ?? 'left' });

    return {
      user,
      selectField,
      selectItem,
    };
  };

  test('Should render correctly', () => {
    const { selectField } = renderComponent('left');

    expect(selectField).toBeInTheDocument();
  });

  test('Should confirmation success message on change position', async () => {
    const { toast } = await import('sonner');

    const { user, selectField, selectItem } = renderComponent('left', 'centro');

    await user.click(selectField);
    await user.click(selectItem());

    expect(toast.success).toHaveBeenCalledWith(
      'Se actualizó la alineación correctamente',
    );
  });

  test('Should set the alignment to the left', async () => {
    const { user, selectField, selectItem } = renderComponent('center', 'izquierda');

    await user.click(selectField);
    await user.click(selectItem());

    await waitFor(() => {
      expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'left');
    });
  });

  test('Should set the alignment to the center', async () => {
    const { user, selectField, selectItem } = renderComponent('left', 'centro');

    await user.click(selectField);
    await user.click(selectItem());

    expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'center');
  });

  test('Should set the alignment to the right', async () => {
    const { user, selectField, selectItem } = renderComponent('left', 'derecha');

    await user.click(selectField);
    await user.click(selectItem());

    expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'right');
  });

  test('Should show error toast when the action fails', async () => {
    const { toast } = await import('sonner');

    mockUpdateAlignmentAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo actualizar',
    });

    const { user, selectField, selectItem } = renderComponent('left', 'centro');

    await user.click(selectField);
    await user.click(selectItem());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar');
    });
  });
});
