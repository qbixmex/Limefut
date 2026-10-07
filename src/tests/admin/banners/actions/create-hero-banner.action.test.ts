const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
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
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createHeroBannerAction } from '@/app/admin/banners/(actions)/create-hero-banner.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', heroBannerMock.title);
  formData.append('description', heroBannerMock.description);
  formData.append('dataAlignment', heroBannerMock.dataAlignment);
  formData.append('showData', heroBannerMock.showData.toString());
  formData.append('position', '1');
  formData.append('active', 'false');
  return formData;
};

const mockTx = {
  heroBanner: {
    aggregate: vi.fn(),
    create: vi.fn(),
  },
};

describe('Tests on createHeroBannerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.heroBanner.aggregate.mockResolvedValue({ _max: { position: 0 } });
    mockTx.heroBanner.create.mockResolvedValue(heroBannerMock);
    mockUploadImage.mockResolvedValue({
      secureUrl: heroBannerMock.imageUrl,
      publicId: heroBannerMock.imagePublicId,
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

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '45dd3c83-6996-4b1c-a8d2-77ceab30f847',
        roles: ['user'],
      },
    });

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '7f85f9c4-0cf0-4df6-8c12-57faff6012f3',
        roles: null,
      },
    });

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '6a7f284e-acd5-4cf2-9d50-f8f5ceb49822',
        roles: [],
      },
    });

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is short', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/mayor a 3/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is long', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(251));

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/menor a 250/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description is short', async () => {
    const formData = validFormData();
    formData.set('description', 'ab');

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/mayor a 3/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description is long', async () => {
    const formData = validFormData();
    formData.set('description', 'x'.repeat(301));

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/menor a 300/i);
    expect(response.heroBanner).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a hero banner without image', async () => {
    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/creado satisfactoriamente/i);
    expect(response.heroBanner).not.toBe(null);
    expect(response.heroBanner?.id).toBe(heroBannerMock.id);

    expect(mockTx.heroBanner.aggregate).toHaveBeenCalledWith({
      _max: { position: true },
    });
    expect(mockTx.heroBanner.create).toHaveBeenCalledOnce();
    expect(mockTx.heroBanner.create).toHaveBeenCalledWith({
      data: {
        title: heroBannerMock.title,
        description: heroBannerMock.description,
        imageUrl: undefined,
        imagePublicId: undefined,
        dataAlignment: heroBannerMock.dataAlignment,
        showData: heroBannerMock.showData,
        position: 1,
        active: false,
      },
    });
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should calculate the next position from the max position', async () => {
    mockTx.heroBanner.aggregate.mockResolvedValue({ _max: { position: 4 } });

    await createHeroBannerAction(validFormData());

    expect(mockTx.heroBanner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ position: 5 }),
      }),
    );
  });

  test('Should create a hero banner with image', async () => {
    const formData = validFormData();
    const imageFile = new File(['image'], 'banner.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(true);
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'hero-banners');
    expect(mockTx.heroBanner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageUrl: heroBannerMock.imageUrl,
          imagePublicId: heroBannerMock.imagePublicId,
        }),
      }),
    );
  });

  test('Should create a hero banner without optional values', async () => {
    const mockTinyBanner = {
      title: 'Cursos de verano',
      description: 'Inscríbase a los cursos de verano',
    };
    const formData = new FormData();
    formData.append('title', mockTinyBanner.title);
    formData.append('description', mockTinyBanner.description);

    const response = await createHeroBannerAction(formData);

    expect(response.ok).toBe(true);
    expect(mockTx.heroBanner.create).toHaveBeenCalledWith({
      data: {
        title: mockTinyBanner.title,
        description: mockTinyBanner.description,
        imageUrl: undefined,
        imagePublicId: undefined,
        dataAlignment: undefined,
        showData: false,
        position: 1,
        active: false,
      },
    });
  });

  test('Should reject when image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    const imageFile = new File(['image'], 'banner.png', { type: 'image/png' });
    formData.append('image', imageFile);

    await expect(createHeroBannerAction(formData))
      .rejects
      .toThrow('Error subiendo imagen a cloudinary');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'HeroBanner', target: ['title'] },
      }),
    );

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/duplicado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'HeroBanner' },
      }),
    );

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el hero banner/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on unexpected Error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on unexpected non-error value', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createHeroBannerAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });
});
