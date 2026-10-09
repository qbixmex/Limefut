import { renderHook, act } from '@testing-library/react';
import { useEditCustomPage } from '@/app/admin/paginas/editar/[id]/use-edit-custom-page';
import { ROUTES } from '@/shared/constants/routes';
import { customPageMock } from '../mocks/custom-page.mock';
import type { CustomPageImage } from '@/shared/interfaces/Page';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      formData: FormData;
      pageId: string;
    }) => Promise<{ ok: boolean; message: string; page: null }>
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

vi.mock('@/app/admin/paginas/(actions)/updatePageAction', () => ({
  updatePageAction: mockUpdateAction,
}));

const validData = {
  title: customPageMock.title,
  permalink: customPageMock.permalink,
  content: customPageMock.content,
  seoTitle: customPageMock.seoTitle,
  seoDescription: customPageMock.seoDescription,
  seoRobots: customPageMock.seoRobots,
  position: customPageMock.position,
  status: customPageMock.status,
};

const newImage: CustomPageImage = {
  id: 'image-3',
  imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-3.jpg',
  resourceId: 'pages/image-3',
};

describe('Tests on useEditCustomPage hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'La página fue guardada correctamente',
      page: null,
    });
  });

  test('Should initialize form with the page values', () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    const values = result.current.form.getValues();

    expect(values.title).toBe(customPageMock.title);
    expect(values.permalink).toBe(customPageMock.permalink);
    expect(values.content).toBe(customPageMock.content);
    expect(values.seoTitle).toBe(customPageMock.seoTitle);
    expect(values.seoRobots).toBe(customPageMock.seoRobots);
    expect(values.position).toBe(customPageMock.position);
    expect(values.status).toBe(customPageMock.status);
  });

  test('Should initialize the content images from the page', () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    expect(result.current.contentImages).toEqual(customPageMock.images);
  });

  test('onSubmit should call updatePageAction with the correct params', async () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        pageId: customPageMock.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('title')).toBe(customPageMock.title);
    expect(formData.get('permalink')).toBe(customPageMock.permalink);
    expect(formData.get('content')).toBe(customPageMock.content);
    expect(formData.get('seoTitle')).toBe(customPageMock.seoTitle);
    expect(formData.get('seoRobots')).toBe(customPageMock.seoRobots);
    expect(formData.get('position')).toBe(String(customPageMock.position));
    expect(formData.get('status')).toBe(customPageMock.status);
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('La página fue guardada correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CUSTOM_PAGES);
  });

  test('onSubmit should not navigate when saving as draft', async () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    act(() => {
      result.current.onSaveDraft();
    });

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(result.current.isDraft).toBe(false);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('onSubmit should show error toast and not navigate on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo guardar la página',
      page: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('No se pudo guardar la página');
    expect(mockReplace).not.toHaveBeenCalled();
  });

  test('handleNavigateBack should navigate to the custom pages list', () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    act(() => {
      result.current.handleNavigateBack();
    });

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_CUSTOM_PAGES);
  });

  test('updateContentImage should append a new image to the local state', () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    act(() => {
      result.current.updateContentImage(newImage);
    });

    expect(result.current.contentImages).toHaveLength(customPageMock.images.length + 1);
    expect(result.current.contentImages).toContainEqual(newImage);
  });

  test('removeContentImage should filter the image by resourceId', () => {
    const { result } = renderHook(() => useEditCustomPage(customPageMock));

    act(() => {
      result.current.removeContentImage(customPageMock.images[0].resourceId);
    });

    expect(result.current.contentImages).toHaveLength(customPageMock.images.length - 1);
    expect(result.current.contentImages).not.toContainEqual(customPageMock.images[0]);
    expect(result.current.contentImages).toContainEqual(customPageMock.images[1]);
  });
});
