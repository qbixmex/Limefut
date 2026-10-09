const {
  mockTransaction,
  mockDeleteImage,
  mockGetSession,
} = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
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
    $transaction: mockTransaction,
  },
}));

vi.mock('@/app/admin/paginas/(actions)/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

import { deletePageAction } from '@/app/admin/paginas/(actions)/deletePageAction';

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

const mockTx = {
  customPage: {
    findUnique: vi.fn(),
    delete: vi.fn(),
    updateMany: vi.fn(),
  },
};

describe('Tests on deletePageAction server action', () => {
  const testId = '4382cdb1-f582-4232-9da8-270cd542ba07';
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockTx.customPage.findUnique.mockResolvedValue({
      title: 'Página de prueba',
      position: 2,
      images: [],
    });
    mockTx.customPage.delete.mockResolvedValue({ id: pageId });
    mockTx.customPage.updateMany.mockResolvedValue({ count: 1 });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({ user: { id: testId, roles: null } });

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({ user: { id: testId, roles: ['user'] } });

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({ user: { id: testId, roles: [] } });

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when page does not exist', async () => {
    mockTx.customPage.findUnique.mockResolvedValue(null);

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar la página/i);
    expect(mockTx.customPage.delete).not.toHaveBeenCalled();
    expect(mockTx.customPage.updateMany).not.toHaveBeenCalled();
  });

  test('Should delete a page without images and shift positions', async () => {
    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/ha sido eliminada correctamente/i);
    expect(mockTx.customPage.delete).toHaveBeenCalledWith({ where: { id: pageId } });
    expect(mockTx.customPage.updateMany).toHaveBeenCalledWith({
      where: { position: { gt: 2 } },
      data: { position: { decrement: 1 } },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete every content image from cloudinary', async () => {
    mockTx.customPage.findUnique.mockResolvedValue({
      title: 'Página con imágenes',
      position: 1,
      images: [
        { id: 'image-1', publicId: 'pages/image-1' },
        { id: 'image-2', publicId: 'pages/image-2' },
      ],
    });

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).toHaveBeenCalledTimes(2);
    expect(mockDeleteImage).toHaveBeenCalledWith('pages/image-1');
    expect(mockDeleteImage).toHaveBeenCalledWith('pages/image-2');
  });

  test('Should return generic error when the transaction fails', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await deletePageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
