const { mockUpdate, mockUploadImage, mockGetSession } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
  mockUploadImage: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: async () => {
    const session = await mockGetSession();

    if (!session?.user) {
      return {
        ok: false,
        message: 'Debes estar autentificado para realizar esta acción',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: 'No tienes permisos administrativos para realizar esta acción',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    customPage: {
      update: mockUpdate,
    },
  },
}));

vi.mock('@/shared/actions', () => ({
  uploadImage: mockUploadImage,
}));

import { uploadPageContentImageAction } from '@/app/admin/paginas/(actions)/uploadPageContentImageAction';

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';
const cloudinaryResponse = {
  publicId: 'pages/image-1',
  secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-1.jpg',
};

const imageFile = () => new File(['image'], 'image.png', { type: 'image/png' });

describe('Tests on uploadPageContentImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockUploadImage.mockResolvedValue(cloudinaryResponse);
    mockUpdate.mockResolvedValue({ id: pageId });
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await uploadPageContentImageAction(imageFile(), pageId);

    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.cloudinaryResponse).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: null } });

    const response = await uploadPageContentImageAction(imageFile(), pageId);

    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.cloudinaryResponse).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: ['user'] } });

    const response = await uploadPageContentImageAction(imageFile(), pageId);

    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.cloudinaryResponse).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: [] } });

    const response = await uploadPageContentImageAction(imageFile(), pageId);

    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.cloudinaryResponse).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when the image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const response = await uploadPageContentImageAction(imageFile(), pageId);

    expect(response.message).toMatch(/no se pudo subir la imagen/i);
    expect(response.cloudinaryResponse).toBe(null);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should upload the image and attach it to the page', async () => {
    const file = imageFile();

    const response = await uploadPageContentImageAction(file, pageId);

    expect(response.message).toMatch(/imagen cargada satisfactoriamente/i);
    expect(response.cloudinaryResponse).toEqual(cloudinaryResponse);
    expect(mockUploadImage).toHaveBeenCalledWith(file, 'pages');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: pageId },
      data: {
        images: {
          create: {
            imageUrl: cloudinaryResponse.secureUrl,
            publicId: cloudinaryResponse.publicId,
          },
        },
      },
    });
  });
});
