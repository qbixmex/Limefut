const {
  mockFindUnique,
  mockTransaction,
  mockDeleteMany,
  mockDeleteImage,
  mockGetSession,
} = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockTransaction: vi.fn(),
  mockDeleteMany: vi.fn(),
  mockDeleteImage: vi.fn(),
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
      findUnique: mockFindUnique,
    },
    $transaction: mockTransaction,
  },
}));

vi.mock('@/app/admin/paginas/(actions)/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

import { deleteContentImageAction } from '@/app/admin/paginas/(actions)/delete-content-image';

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';
const publicId = 'pages/image-1';
const imageUrl = 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-1.jpg';

const mockTx = {
  customPageImage: {
    deleteMany: mockDeleteMany,
  },
};

describe('Tests on deleteContentImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockFindUnique.mockResolvedValue({
      id: pageId,
      images: [{ publicId, imageUrl }],
    });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: null } });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: ['user'] } });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: [] } });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should return error when page does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/la página no existe/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when page has no images', async () => {
    mockFindUnique.mockResolvedValue({ id: pageId, images: [] });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no hay imágenes para eliminar/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the image does not exist', async () => {
    mockFindUnique.mockResolvedValue({
      id: pageId,
      images: [{ publicId: 'pages/other', imageUrl }],
    });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should delete the image record and return the remaining images', async () => {
    const remaining = {
      publicId: 'pages/image-2',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/pages/image-2.jpg',
    };
    mockFindUnique
      .mockResolvedValueOnce({ id: pageId, images: [{ publicId, imageUrl }] })
      .mockResolvedValueOnce({ images: [remaining] });

    const response = await deleteContentImageAction(pageId, publicId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/imagen del contenido ha sido eliminada/i);
    expect(mockDeleteMany).toHaveBeenCalledWith({ where: { publicId } });
    expect(mockDeleteImage).toHaveBeenCalledWith(publicId);
    expect(response.customPageImages).toEqual([
      { imageUrl: remaining.imageUrl, resourceId: remaining.publicId },
    ]);
  });
});
