const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockUploadImage,
  mockDeleteImage,
  mockGetSession,
} = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    constructor(
      message: string,
      options: { code: string; meta?: Record<string, unknown> },
    ) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }
  return {
    MockPrismaClientKnownRequestError,
    mockTransaction: vi.fn(),
    mockUploadImage: vi.fn(),
    mockDeleteImage: vi.fn(),
    mockGetSession: vi.fn(),
  };
});

vi.mock('next/cache');

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

vi.mock('@/shared/actions', () => ({
  uploadImage: mockUploadImage,
  deleteImage: mockDeleteImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateGalleryImageAction } from '@/app/admin/galerias/(actions)/gallery-images/update-gallery-image.action';
import { updateTag } from 'next/cache';

const galleryImageId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const galleryId = 'gallery-1';
const testImagePublicId = 'new-public-id';
const testImageUrl = 'https://cloudinary.com/new/image.jpg';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Imagen Actualizada');
  formData.append('position', '3');
  formData.append('active', 'false');
  return formData;
};

const mockUpdatedGalleryImage = {
  id: galleryImageId,
  title: 'Imagen Actualizada',
  imageUrl: testImageUrl,
  imagePublicID: testImagePublicId,
  active: false,
  position: 3,
};

const mockTx = {
  galleryImage: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on updateGalleryImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.galleryImage.findUnique.mockResolvedValue({
      id: galleryImageId,
      position: 3,
      galleryId,
      imagePublicID: 'old-public-id',
    });
    mockTx.galleryImage.findMany.mockResolvedValue([
      { id: galleryImageId, position: 3 },
    ]);
    mockTx.galleryImage.update.mockResolvedValue(mockUpdatedGalleryImage);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      secureUrl: testImageUrl,
      publicId: testImagePublicId,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre debe ser mayor a 3 caracteres/i);
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title exceeds 50 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(51));

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre debe ser menor a 50 caracteres/i);
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when image exceeds 2MB', async () => {
    const formData = validFormData();
    formData.append(
      'image',
      new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' }),
    );

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tamaño máximo de la imagen/i);
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when image type is not allowed', async () => {
    const formData = validFormData();
    formData.append('image', new File(['x'], 'document.txt', { type: 'text/plain' }));

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tipo de archivo debe ser uno de los siguientes/i);
    expect(response.galleryImage).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when gallery image does not exist', async () => {
    mockTx.galleryImage.findUnique.mockResolvedValue(null);

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ La imagen de la galería no existe o ha sido eliminada !');
    expect(response.galleryImage).toBe(null);
    expect(mockTx.galleryImage.findMany).not.toHaveBeenCalled();
    expect(mockTx.galleryImage.update).not.toHaveBeenCalled();
  });

  test('Should update title and active when position is unchanged (no image)', async () => {
    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/imagen de la galería fue actualizada/i);
    expect(response.galleryImage).toEqual(mockUpdatedGalleryImage);
    expect(mockTx.galleryImage.findUnique).toHaveBeenCalledWith({
      where: { id: galleryImageId },
      select: { id: true, position: true, galleryId: true, imagePublicID: true },
    });
    expect(mockTx.galleryImage.findMany).toHaveBeenCalledWith({
      where: { galleryId },
      select: { id: true, position: true },
      orderBy: { position: 'asc' },
    });
    expect(mockTx.galleryImage.update).toHaveBeenCalledOnce();
    expect(mockTx.galleryImage.update).toHaveBeenCalledWith({
      where: { id: galleryImageId },
      data: { title: 'Imagen Actualizada', active: false },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUploadImage).not.toHaveBeenCalled();
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-home-images');
  });

  test('Should replace the image when position is unchanged and a new image is provided', async () => {
    mockTx.galleryImage.update.mockResolvedValue({
      ...mockUpdatedGalleryImage,
      imagePublicID: 'old-public-id',
    });

    const formData = validFormData();
    const imageFile = new File(['new-bytes'], 'new.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).toHaveBeenCalledWith('old-public-id');
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'teams');
    expect(mockTx.galleryImage.update).toHaveBeenCalledTimes(2);
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(1, {
      where: { id: galleryImageId },
      data: { title: 'Imagen Actualizada', active: false },
    });
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(2, {
      where: { id: galleryImageId },
      data: { imageUrl: testImageUrl, imagePublicID: testImagePublicId },
    });
  });

  test('Should not call deleteImage when the current image has no public id', async () => {
    mockTx.galleryImage.findUnique.mockResolvedValue({
      id: galleryImageId,
      position: 1,
      galleryId,
      imagePublicID: null,
    });
    mockTx.galleryImage.findMany.mockResolvedValue([{ id: galleryImageId, position: 1 }]);
    mockTx.galleryImage.update.mockResolvedValue({
      ...mockUpdatedGalleryImage,
      imagePublicID: null,
    });

    const formData = validFormData();
    formData.set('position', '1');
    const imageFile = new File(['new-bytes'], 'new.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'teams');
  });

  test('Should shift positions up when moving to a lower position', async () => {
    mockTx.galleryImage.findMany.mockResolvedValue([
      { id: 'img-a', position: 1 },
      { id: 'img-b', position: 2 },
      { id: galleryImageId, position: 3 },
    ]);

    const formData = validFormData();
    formData.set('position', '1');

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(true);
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'img-b' },
      data: { position: 3 },
    });
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'img-a' },
      data: { position: 2 },
    });
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(3, {
      where: { id: galleryImageId },
      data: { title: 'Imagen Actualizada', active: false, position: 1 },
    });
  });

  test('Should shift positions down when moving to a higher position', async () => {
    mockTx.galleryImage.findUnique.mockResolvedValue({
      id: galleryImageId,
      position: 1,
      galleryId,
      imagePublicID: 'old-public-id',
    });
    mockTx.galleryImage.findMany.mockResolvedValue([
      { id: galleryImageId, position: 1 },
      { id: 'img-b', position: 2 },
      { id: 'img-c', position: 3 },
    ]);

    const formData = validFormData();
    formData.set('position', '3');

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(true);
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(1, {
      where: { id: 'img-b' },
      data: { position: 1 },
    });
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(2, {
      where: { id: 'img-c' },
      data: { position: 2 },
    });
    expect(mockTx.galleryImage.update).toHaveBeenNthCalledWith(3, {
      where: { id: galleryImageId },
      data: { title: 'Imagen Actualizada', active: false, position: 3 },
    });
  });

  test('Should return error when deleteImage from cloudinary fails', async () => {
    mockDeleteImage.mockResolvedValue({ ok: false });

    const formData = validFormData();
    formData.append('image', new File(['new-bytes'], 'new.png', { type: 'image/png' }));

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar la imagen de la galería/i);
    expect(response.galleryImage).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when uploadImage to cloudinary fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    formData.append('image', new File(['new-bytes'], 'new.png', { type: 'image/png' }));

    const response = await updateGalleryImageAction({ formData, galleryImageId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar la imagen de la galería/i);
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'GalleryImage', target: ['title'] },
      }),
    );

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El campo "title", está duplicado');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on prisma known error with meta (non P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'GalleryImage', target: ['galleryId'] },
      }),
    );

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar la imagen de la galería/i);
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar la imagen de la galería/i);
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updateGalleryImageAction({
      formData: validFormData(),
      galleryImageId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.galleryImage).toBe(null);
  });
});
