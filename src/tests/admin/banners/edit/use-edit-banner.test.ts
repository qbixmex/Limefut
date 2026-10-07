import { renderHook, act } from '@testing-library/react';
import { useEditBanner } from '@/app/admin/banners/editar/[id]/use-edit-banner';
import { ROUTES } from '@/shared/constants/routes';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      heroBannerId: string;
    }) => Promise<{ ok: boolean; message: string; heroBanner: null }>
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

vi.mock('@/app/admin/banners/(actions)', () => ({
  updateHeroBannerAction: mockUpdateAction,
}));

const validData = {
  title: heroBannerMock.title,
  description: heroBannerMock.description,
  dataAlignment: 'left' as const,
  showData: heroBannerMock.showData,
  position: heroBannerMock.position,
  active: heroBannerMock.active,
};

describe('Tests on useEditBanner hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El banner fue actualizado correctamente',
      heroBanner: null,
    });
  });

  test('Should initialize form with banner values', () => {
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    const values = result.current.form.getValues();

    expect(values.title).toBe(heroBannerMock.title);
    expect(values.description).toBe(heroBannerMock.description);
    expect(values.dataAlignment).toBe(heroBannerMock.dataAlignment);
    expect(values.showData).toBe(heroBannerMock.showData);
    expect(values.position).toBe(heroBannerMock.position);
    expect(values.active).toBe(heroBannerMock.active);
  });

  test('onSubmit should call updateHeroBannerAction with correct params', async () => {
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        heroBannerId: heroBannerMock.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe(heroBannerMock.title);
    expect(formData.get('description')).toBe(heroBannerMock.description);
    expect(formData.get('dataAlignment')).toBe(heroBannerMock.dataAlignment);
    expect(formData.get('showData')).toBe(String(heroBannerMock.showData));
    expect(formData.get('position')).toBe(String(heroBannerMock.position));
    expect(formData.get('active')).toBe(String(heroBannerMock.active));
  });

  test('onSubmit should append image when a File is provided', async () => {
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));
    const image = new File(['image'], 'banner.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image });
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(image);
  });

  test('onSubmit should not append image when no image was provided', async () => {
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('El banner fue actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(
      ROUTES.ADMIN_BANNERS_SHOW(heroBannerMock.id),
    );
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el banner',
      heroBanner: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el banner');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate to banners list', () => {
    const { result } = renderHook(() => useEditBanner({ heroBanner: heroBannerMock }));

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_BANNERS);
  });
});
