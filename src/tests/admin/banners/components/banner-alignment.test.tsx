import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BannerAlignment } from '@/app/admin/banners/(components)/banner-alignment';
import { ALIGNMENT } from '@/shared/enums';

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

  test('Should render correctly', () => {
    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={ALIGNMENT.LEFT}
      />,
    );

    const select = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });

    expect(select).toBeInTheDocument();
  });

  test('Should confirmation success message on change position', async () => {
    const { toast } = await import('sonner');

    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={ALIGNMENT.LEFT}
      />,
    );

    const selectField = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });

    const user = userEvent.setup();
    await user.click(selectField);

    const selectItem = await screen.findByRole('option', { name: /centro/i });
    await user.click(selectItem);

    expect(toast.success).toHaveBeenCalledWith(
      'Se actualizó la alineación correctamente',
    );
  });

  test('Should set the alignment to the left', async () => {
    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={ALIGNMENT.CENTER}
      />,
    );

    const selectField = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });

    const user = userEvent.setup();
    await user.click(selectField);

    const selectItem = await screen.findByRole('option', { name: /izquierda/i });
    await user.click(selectItem);

    expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'left');
  });

  test('Should set the alignment to the center', async () => {
    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={ALIGNMENT.LEFT}
      />,
    );

    const selectField = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });

    const user = userEvent.setup();
    await user.click(selectField);

    const selectItem = await screen.findByRole('option', { name: /centro/i });
    await user.click(selectItem);

    expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'center');
  });

  test('Should set the alignment to the right', async () => {
    render(
      <BannerAlignment
        bannerId={bannerId}
        alignment={ALIGNMENT.CENTER}
      />,
    );

    const selectField = screen.getByRole('combobox', {
      name: /alineación del banner/i,
    });

    const user = userEvent.setup();
    await user.click(selectField);

    const selectItem = await screen.findByRole('option', { name: /derecha/i });
    await user.click(selectItem);

    expect(mockUpdateAlignmentAction).toHaveBeenCalledWith(bannerId, 'right');
  });

  test('Should show error toast when the action fails', async () => {
    const { toast } = await import('sonner');
    mockUpdateAlignmentAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo actualizar',
    });

    render(<BannerAlignment bannerId={bannerId} alignment={ALIGNMENT.LEFT} />);

    const selectField = screen.getByRole('combobox', { name: /alineación del banner/i });
    const user = userEvent.setup();
    await user.click(selectField);

    const selectItem = await screen.findByRole('option', { name: /derecha/i });
    await user.click(selectItem);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar');
    });
  });
});
