const {
  MockPrismaClientKnownRequestError,
  mockFindFirst,
  mockCreate,
  mockUploadImage,
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
    mockFindFirst: vi.fn(),
    mockCreate: vi.fn(),
    mockUploadImage: vi.fn(),
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
    gallery: {
      findFirst: mockFindFirst,
    },
    galleryImage: {
      create: mockCreate,
    },
  },
}));

vi.mock('~/src/shared/actions', () => ({
  uploadImage: mockUploadImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createGalleryImageAction } from '@/app/admin/galerias/(actions)/gallery-images/create-gallery-image.action';
import { updateTag } from 'next/cache';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const testImagePublicId = '7b400e5df46c';
const testImageUrl = 'https://cloudinary.com/test/image.jpg';

const imageFile = () => new File(['image-bytes'], 'image.png', { type: 'image/png' });

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Imagen de prueba');
  formData.append('position', '1');
  formData.append('active', 'true');
  formData.append('image', imageFile());
  return formData;
};

const mockCreatedGalleryImage = {
  id: 'img-1',
  title: 'Imagen de prueba',
  imageUrl: testImageUrl,
  imagePublicID: testImagePublicId,
  active: true,
  position: 1,
  galleryId,
};

describe('Tests on createGalleryImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue({ id: galleryId, permalink: 'galeria-test' });
    mockCreate.mockResolvedValue(mockCreatedGalleryImage);
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

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/título debe ser mayor a 3 caracteres/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when title exceeds 50 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(51));

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/título debe ser menor a 50 caracteres/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when image is missing', async () => {
    const formData = validFormData();
    formData.delete('image');

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/imagen debe ser un archivo/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when image exceeds 2MB', async () => {
    const formData = validFormData();
    formData.set(
      'image',
      new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.png', { type: 'image/png' }),
    );

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tamaño máximo de la imagen/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when image type is not allowed', async () => {
    const formData = validFormData();
    formData.set('image', new File(['x'], 'document.txt', { type: 'text/plain' }));

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tipo de archivo debe ser uno de los siguientes/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when position is not a number', async () => {
    const formData = validFormData();
    formData.set('position', 'not-a-number');

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/posición debe ser un número válido/i);
    expect(response.galleryImage).toBe(null);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error when gallery does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe(`La galeria con el id "${galleryId}" no existe`);
    expect(response.galleryImage).toBe(null);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: galleryId },
      select: { id: true, permalink: true },
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should create a gallery image successfully', async () => {
    const formData = validFormData();
    const uploadedFile = formData.get('image') as File;

    const response = await createGalleryImageAction({ galleryId, formData });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La imagen su cargó correctamente');
    expect(response.galleryImage).toEqual(mockCreatedGalleryImage);
    expect(mockUploadImage).toHaveBeenCalledWith(uploadedFile, 'gallery_images');
    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        title: 'Imagen de prueba',
        imageUrl: testImageUrl,
        imagePublicID: testImagePublicId,
        active: true,
        position: 1,
        galleryId,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('admin-gallery');
    expect(updateTag).toHaveBeenCalledWith('dashboard-images');
    expect(updateTag).toHaveBeenCalledWith('public-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-gallery');
    expect(updateTag).toHaveBeenCalledWith('public-home-images');
  });

  test('Should throw when image upload to cloudinary fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    await expect(
      createGalleryImageAction({ galleryId, formData: validFormData() }),
    ).rejects.toThrow('Error subiendo imagen a cloudinary');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockCreate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'GalleryImage', target: ['title'] },
      }),
    );

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El campo "title", está duplicado');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on prisma known error with meta (non P2002)', async () => {
    mockCreate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'GalleryImage', target: ['galleryId'] },
      }),
    );

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al subir la imagen, revise los logs del servidor');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockCreate.mockRejectedValue(new Error('Something went wrong'));

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al subir la imagen, revise los logs del servidor');
    expect(response.galleryImage).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockCreate.mockRejectedValue('Something unexpected');

    const response = await createGalleryImageAction({
      galleryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.galleryImage).toBe(null);
  });
});
