import { renderHook, act } from '@testing-library/react';
import { useCreateBanner } from '@/app/admin/banners/crear/use-create-banner';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (formData: FormData) => Promise<{
      ok: boolean;
      message: string;
      heroBanner: { id: string } | null;
    }>
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
  createHeroBannerAction: mockCreateAction,
}));

const validData = {
  title: 'Banner de bienvenida',
  description: 'Descripción del banner de bienvenida',
  dataAlignment: 'left' as const,
  showData: true,
  position: 2,
  active: true,
};

describe('Tests on useCreateBanner hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: 'Hero banner creado satisfactoriamente',
      heroBanner: { id: '27ddd95b-0b57-4e1f-ab45-efac9bccdae4' },
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateBanner());

    const values = result.current.form.getValues();

    expect(values.title).toBe('');
    expect(values.description).toBe('');
    expect(values.image).toBeUndefined();
    expect(values.dataAlignment).toBe('left');
    expect(values.showData).toBe(false);
    expect(values.position).toBe(0);
    expect(values.active).toBe(false);
  });

  test('onSubmit should call createHeroBannerAction with correct params', async () => {
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(expect.any(FormData));

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe(validData.title);
    expect(formData.get('description')).toBe(validData.description);
    expect(formData.get('dataAlignment')).toBe(validData.dataAlignment);
    expect(formData.get('showData')).toBe('true');
    expect(formData.get('position')).toBe('2');
    expect(formData.get('active')).toBe('true');
  });

  test('onSubmit should trim title', async () => {
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit({
        ...validData,
        title: '  Banner de bienvenida  ',
      });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe('Banner de bienvenida');
  });

  test('onSubmit should trim description', async () => {
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit({
        ...validData,
        description: '  Descripción  ',
      });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('description')).toBe('Descripción');
  });

  test('onSubmit should append image when a File is provided', async () => {
    const { result } = renderHook(() => useCreateBanner());
    const image = new File(['image'], 'banner.png', { type: 'image/png' });

    await act(async () => {
      await result.current.onSubmit({ ...validData, image });
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBe(image);
  });

  test('onSubmit should not append image when no image was provided', async () => {
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const formData = mockCreateAction.mock.calls[0][0];
    expect(formData.get('image')).toBeNull();
  });

  test('onSubmit should show success toast when form is submitted', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Hero banner creado satisfactoriamente');
  });

  test('onSubmit should reset the form after submitting', async () => {
    const { result } = renderHook(() => useCreateBanner());

    act(() => {
      result.current.form.setValues(validData);
    });

    expect(result.current.form.getValues().title).toBe(validData.title);
    expect(result.current.form.getValues().description).toBe(validData.description);
    expect(result.current.form.getValues().active).toBe(validData.active);

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    const values = result.current.form.getValues();
    expect(values.title).toBe('');
    expect(values.description).toBe('');
    expect(values.active).toBe(false);
  });

  test('onSubmit should navigate to banners list', async () => {
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_BANNERS);
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el banner',
      heroBanner: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateBanner());

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el banner');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate to banners list', () => {
    const { result } = renderHook(() => useCreateBanner());

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_BANNERS);
  });
});
