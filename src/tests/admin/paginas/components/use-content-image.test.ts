import { renderHook, act } from '@testing-library/react';
import { useContentImage } from '@/app/admin/paginas/(components)/content-images/use-content-image';
import type { CustomPageImage } from '@/shared/interfaces/Page';

const { mockDeleteImageAction } = vi.hoisted(() => ({
  mockDeleteImageAction: vi.fn<
    (pageId: string, publicId: string) => Promise<{ ok: boolean; message: string }>
  >(),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock('@/app/admin/paginas/(actions)/delete-content-image', () => ({
  deleteContentImageAction: mockDeleteImageAction,
}));

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';
const image: CustomPageImage = {
  id: '6bebd4cc-4087-4148-95d7-5e169a81374b',
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-1.jpg',
  resourceId: 'pages/6bebd4cc-4087-4148-95d7-5e169a81374b',
};

const setClipboard = (value: unknown) => {
  Object.defineProperty(navigator, 'clipboard', {
    value,
    configurable: true,
  });
};

describe('Tests on useContentImage hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteImageAction.mockResolvedValue({
      ok: true,
      message: 'La imagen del contenido ha sido eliminada',
    });
  });

  afterEach(() => {
    setClipboard(undefined);
  });

  test('handleDeleteImage should call the action with pageId and resourceId', async () => {
    const onImageDeleted = vi.fn();
    const { result } = renderHook(() => useContentImage(pageId, onImageDeleted));

    await act(async () => {
      await result.current.handleDeleteImage(image);
    });

    expect(mockDeleteImageAction).toHaveBeenCalledWith(pageId, image.resourceId);
  });

  test('handleDeleteImage should notify the parent and show success toast on success', async () => {
    const { toast } = await import('sonner');
    const onImageDeleted = vi.fn();
    const { result } = renderHook(() => useContentImage(pageId, onImageDeleted));

    await act(async () => {
      await result.current.handleDeleteImage(image);
    });

    expect(onImageDeleted).toHaveBeenCalledWith(image.resourceId);
    expect(toast.success).toHaveBeenCalledWith('Imagen eliminada correctamente');
    expect(result.current.isDeletingImage).toBe(null);
  });

  test('handleDeleteImage should show error toast and not notify on failure', async () => {
    mockDeleteImageAction.mockResolvedValue({ ok: false, message: 'No se pudo eliminar' });
    const { toast } = await import('sonner');
    const onImageDeleted = vi.fn();
    const { result } = renderHook(() => useContentImage(pageId, onImageDeleted));

    await act(async () => {
      await result.current.handleDeleteImage(image);
    });

    expect(onImageDeleted).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('No se pudo eliminar la imagen');
    expect(result.current.isDeletingImage).toBe(null);
  });

  test('copyToClipboard should use the clipboard API and return true', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const { result } = renderHook(() => useContentImage(pageId, vi.fn()));

    const ok = await result.current.copyToClipboard(image.imageUrl);

    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith(image.imageUrl);
  });

  test('copyToClipboard should fallback to a prompt and return false', async () => {
    setClipboard(undefined);
    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null);
    const { result } = renderHook(() => useContentImage(pageId, vi.fn()));

    const ok = await result.current.copyToClipboard(image.imageUrl);

    expect(ok).toBe(false);
    expect(promptSpy).toHaveBeenCalledWith('Copia la URL (Cmd/Ctrl+C):', image.imageUrl);
    promptSpy.mockRestore();
  });
});
