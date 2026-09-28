const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockCount,
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
    mockCount: vi.fn(),
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
    coach: {
      count: mockCount,
    },
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

import { createCoachAction } from '@/app/admin/entrenadores/(actions)/create-coach.action';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Roberto Sánchez');
  formData.append('email', 'roberto@email.com');
  formData.append('phone', '+52 555 123 4567');
  formData.append('age', '45');
  formData.append('nationality', 'Mexicana');
  formData.append('description', 'Entrenador con experiencia en categorías formativas');
  formData.append('active', 'true');
  return formData;
};

const mockCreatedCoach = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Roberto Sánchez',
  email: 'roberto@email.com',
  phone: '+52 555 123 4567',
  age: 45,
  nationality: 'Mexicana',
  description: 'Entrenador con experiencia en categorías formativas',
  imageUrl: null,
  imagePublicID: null,
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-15'),
  teams: [],
};

const mockTx = {
  coach: {
    create: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on createCoachAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    const testId = 'b7e2ca32-af95-4750-bf63-6a338b236097';
    mockGetSession.mockResolvedValue({
      user: { id: testId, roles: ['admin'] },
    });
    mockCount.mockResolvedValue(0);
    mockTx.coach.create.mockResolvedValue(mockCreatedCoach);
    mockTx.coach.update.mockResolvedValue({
      imageUrl: null,
      imagePublicID: null,
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

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const testId = 'c45414c0-044b-4319-acbb-45584a0839fa';
    mockGetSession.mockResolvedValue({
      user: { id: testId, roles: ['user'] },
    });

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    const testId = '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef';
    mockGetSession.mockResolvedValue({
      user: { id: testId, roles: null },
    });

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    const testId = 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29';
    mockGetSession.mockResolvedValue({
      user: { id: testId, roles: [] },
    });

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createCoachAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when email already exists', async () => {
    mockCount.mockResolvedValue(1);

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El correo electrónico ya existe, elija otro');
    expect(response.coach).toBe(null);
    expect(mockCount).toHaveBeenCalledWith({
      where: { email: 'roberto@email.com' },
    });
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a coach without image', async () => {
    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.coach).not.toBe(null);
    expect(response.coach?.id).toBe(mockCreatedCoach.id);
    expect(response.coach?.name).toBe(mockCreatedCoach.name);
    expect(response.coach?.imageUrl).toBe(null);
    expect(response.coach?.imagePublicID).toBe(null);

    expect(mockCount).toHaveBeenCalledWith({
      where: { email: 'roberto@email.com' },
    });
    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.coach.create).toHaveBeenCalledOnce();
    expect(mockTx.coach.create).toHaveBeenCalledWith({
      data: {
        name: 'Roberto Sánchez',
        email: 'roberto@email.com',
        phone: '+52 555 123 4567',
        age: 45,
        nationality: 'Mexicana',
        description: 'Entrenador con experiencia en categorías formativas',
        active: true,
      },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    expect(mockTx.coach.update).toHaveBeenCalledOnce();
    expect(mockTx.coach.update).toHaveBeenCalledWith({
      where: { id: mockCreatedCoach.id },
      data: {
        imageUrl: null,
        imagePublicID: null,
      },
      select: {
        imageUrl: true,
        imagePublicID: true,
      },
    });
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should create a coach with image', async () => {
    const testImagePublicId = '7b400e5df46c';
    const testImageUrl = 'https://cloudinary.com/test/image.jpg';
    mockUploadImage.mockResolvedValue({
      secureUrl: testImageUrl,
      publicId: testImagePublicId,
    });
    mockTx.coach.update.mockResolvedValue({
      imageUrl: testImageUrl,
      imagePublicID: testImagePublicId,
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await createCoachAction(formData);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'coaches');
    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.coach.create).toHaveBeenCalledOnce();
    expect(mockTx.coach.update).toHaveBeenCalledWith({
      where: { id: mockCreatedCoach.id },
      data: {
        imageUrl: testImageUrl,
        imagePublicID: testImagePublicId,
      },
      select: {
        imageUrl: true,
        imagePublicID: true,
      },
    });
    expect(response.coach?.imageUrl).toBe(testImageUrl);
    expect(response.coach?.imagePublicID).toBe(testImagePublicId);
  });

  test('Should return error when image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await createCoachAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Coach', target: ['email'] },
      }),
    );

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.coach).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Coach', target: ['teamId'] },
      }),
    );

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el entrenador/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createCoachAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });
});
