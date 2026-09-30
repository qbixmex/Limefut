const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockDeleteImage,
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
    mockTransaction: vi.fn(),
    mockDeleteImage: vi.fn(),
    mockUploadImage: vi.fn(),
    mockGetSession: vi.fn(),
  };
});

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
        message: '¡ Debes estar autentificado para realizar esta acción !',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: '¡ No tienes permisos administrativos para realizar esta acción !',
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
  deleteImage: mockDeleteImage,
  uploadImage: mockUploadImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateHeroBannerAction } from '@/app/admin/banners/(actions)/update-hero-banner.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;
const otherBannerA = { id: 'banner-a', position: 1 };
const otherBannerB = { id: 'banner-b', position: 3 };
const targetBanner = { id: heroBannerMock.id, position: 2 };

const bannersWithPositions = [otherBannerA, targetBanner, otherBannerB];

const validFormData = (position = '2'): FormData => {
  const formData = new FormData();
  formData.append('title', heroBannerMock.title);
  formData.append('description', heroBannerMock.description);
  formData.append('dataAlignment', 'left');
  formData.append('showData', 'true');
  formData.append('position', position);
  formData.append('active', 'true');
  return formData;
};

const mockTx = {
  heroBanner: {
    count: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
};

const mainUpdateData = {
  title: heroBannerMock.title,
  description: heroBannerMock.description,
  dataAlignment: 'left',
  showData: true,
  active: true,
};

describe('Tests on updateHeroBannerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: '42f0595c-7890-4fc7-a659-64ecdc00071f', roles: ['admin'] },
    });
    mockTx.heroBanner.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    mockTx.heroBanner.findMany.mockResolvedValue(bannersWithPositions);
    mockTx.heroBanner.update.mockResolvedValue(heroBannerMock);
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://cloudinary.com/new-image.jpg',
      publicId: 'hero-banners/new-image',
    });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/Debes estar autentificado/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '86d39747-d20a-4b74-930b-32ce5c78fb7c',
        roles: ['user'],
      },
    });

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'f6009ca3-de09-4b89-8fba-fa756208da39',
        roles: null,
      },
    });

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '87a6119a-8f21-408f-9c77-f0835f8f6a44',
        roles: [],
      },
    });

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short title)', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updateHeroBannerAction({
      formData,
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/título/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when banner does not exist', async () => {
    mockTx.heroBanner.count.mockReset();
    mockTx.heroBanner.count.mockResolvedValueOnce(0);

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe o ha sido eliminado/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTx.heroBanner.update).not.toHaveBeenCalled();
  });

  test('Should return error when title already exists', async () => {
    mockTx.heroBanner.count.mockReset();
    mockTx.heroBanner.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1);

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/ya existe/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTx.heroBanner.findMany).not.toHaveBeenCalled();
    expect(mockTx.heroBanner.update).not.toHaveBeenCalled();
  });

  test('Should update a banner keeping the same position', async () => {
    const response = await updateHeroBannerAction({
      formData: validFormData('2'),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/banner fue guardado correctamente/i);
    expect(response.heroBanner).not.toBe(null);

    expect(mockTx.heroBanner.count).toHaveBeenNthCalledWith(1, {
      where: { id: bannerId },
    });
    expect(mockTx.heroBanner.count).toHaveBeenNthCalledWith(2, {
      where: { title: heroBannerMock.title, id: { not: bannerId } },
    });
    expect(mockTx.heroBanner.update).toHaveBeenCalledOnce();
    expect(mockTx.heroBanner.update).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { ...mainUpdateData, position: 2 },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should move the banner up reordering affected positions', async () => {
    const response = await updateHeroBannerAction({
      formData: validFormData('1'),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/banner fue actualizado correctamente/i);

    expect(mockTx.heroBanner.update).toHaveBeenNthCalledWith(1, {
      where: { id: otherBannerA.id },
      data: { position: otherBannerA.position + 1 },
    });
    expect(mockTx.heroBanner.update).toHaveBeenNthCalledWith(2, {
      where: { id: bannerId },
      data: { ...mainUpdateData, position: 1 },
    });
  });

  test('Should move the banner down reordering affected positions', async () => {
    const response = await updateHeroBannerAction({
      formData: validFormData('3'),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/banner fue actualizado correctamente/i);

    expect(mockTx.heroBanner.update).toHaveBeenNthCalledWith(1, {
      where: { id: otherBannerB.id },
      data: { position: otherBannerB.position - 1 },
    });
    expect(mockTx.heroBanner.update).toHaveBeenNthCalledWith(2, {
      where: { id: bannerId },
      data: { ...mainUpdateData, position: 3 },
    });
  });

  test('Should clamp the requested position to the available range', async () => {
    await updateHeroBannerAction({
      formData: validFormData('99'),
      heroBannerId: bannerId,
    });

    expect(mockTx.heroBanner.update).toHaveBeenLastCalledWith({
      where: { id: bannerId },
      data: { ...mainUpdateData, position: 3 },
    });
  });

  test('Should update the banner image when a File is provided', async () => {
    const imageFile = new File(['image'], 'banner.png', { type: 'image/png' });
    const formData = validFormData('2');
    formData.append('image', imageFile);

    const response = await updateHeroBannerAction({
      formData,
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).toHaveBeenCalledWith(heroBannerMock.imagePublicId);
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'hero-banners');
    expect(mockTx.heroBanner.update).toHaveBeenNthCalledWith(2, {
      where: { id: bannerId },
      data: {
        imageUrl: 'https://cloudinary.com/new-image.jpg',
        imagePublicId: 'hero-banners/new-image',
      },
    });
  });

  test('Should return error when cloudinary image deletion fails', async () => {
    mockDeleteImage.mockResolvedValue({ ok: false });
    const imageFile = new File(['image'], 'banner.png', { type: 'image/png' });
    const formData = validFormData('2');
    formData.append('image', imageFile);

    const response = await updateHeroBannerAction({
      formData,
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error when cloudinary image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);
    const imageFile = new File(['image'], 'banner.png', { type: 'image/png' });
    const formData = validFormData('2');
    formData.append('image', imageFile);

    const response = await updateHeroBannerAction({
      formData,
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.heroBanner.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'HeroBanner', target: ['title'] },
      }),
    );

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/duplicado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes inside transaction', async () => {
    mockTx.heroBanner.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'HeroBanner' },
      }),
    );

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el banner/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on unexpected Error inside transaction', async () => {
    mockTx.heroBanner.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on unexpected non-error value inside transaction', async () => {
    mockTx.heroBanner.update.mockRejectedValue('Something unexpected');

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updateHeroBannerAction({
      formData: validFormData(),
      heroBannerId: bannerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });
});
