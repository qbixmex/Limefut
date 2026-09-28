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
  uploadImage: mockUploadImage,
  deleteImage: mockDeleteImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateCoachAction } from '@/app/admin/entrenadores/(actions)/update-coach.action';

const coachId = '550e8400-e29b-41d4-a716-446655440001';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Roberto Sánchez');
  formData.append('email', 'roberto@email.com');
  formData.append('phone', '+52 555 123 4567');
  formData.append('age', '45');
  formData.append('nationality', 'Mexicana');
  formData.append('description', 'Entrenador con experiencia en categorías formativas');
  formData.append('active', 'true');
  formData.append('teamsIds', JSON.stringify(['f784c643-c39f-4867-9d7c-9b5c571a84c4']));
  return formData;
};

const mockUpdatedCoach = {
  id: coachId,
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
};

const mockTx = {
  coach: {
    count: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on updateCoachAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.coach.count.mockResolvedValue(1);
    mockTx.coach.update.mockResolvedValue(mockUpdatedCoach);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await updateCoachAction({
      coachId,
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.coach).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when coach does not exist', async () => {
    mockTx.coach.count.mockResolvedValue(0);

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.coach).toBe(null);
    expect(mockTx.coach.update).not.toHaveBeenCalled();
  });

  test('Should update a coach without image', async () => {
    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.coach).not.toBe(null);
    expect(response.coach?.id).toBe(mockUpdatedCoach.id);
    expect(response.coach?.name).toBe(mockUpdatedCoach.name);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.coach.count).toHaveBeenCalledWith({
      where: { id: coachId },
    });
    expect(mockTx.coach.update).toHaveBeenCalledTimes(1);
    expect(mockTx.coach.update).toHaveBeenCalledWith({
      where: { id: coachId },
      data: {
        name: 'Roberto Sánchez',
        email: 'roberto@email.com',
        phone: '+52 555 123 4567',
        age: 45,
        nationality: 'Mexicana',
        description: 'Entrenador con experiencia en categorías formativas',
        active: true,
      },
    });
    expect(mockUploadImage).not.toHaveBeenCalled();
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should update a coach with image replacement', async () => {
    const previousImageUrlTest = 'https://cloudinary.com/new/previous-image.jpg';
    const previousPublicIdTest = '88d33dc827e1';
    const newImageUrlTest = 'https://cloudinary.com/new/new-image.jpg';
    const newPublicIdTest = '29938b28ed3b';
    mockTx.coach.update.mockResolvedValue({
      ...mockUpdatedCoach,
      imageUrl: previousImageUrlTest,
      imagePublicID: previousPublicIdTest,
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      secureUrl: newImageUrlTest,
      publicId: newPublicIdTest,
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateCoachAction({
      coachId,
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockDeleteImage).toHaveBeenCalledWith(previousPublicIdTest);
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'coaches');
    expect(mockTx.coach.update).toHaveBeenCalledTimes(2);
    expect(response.coach?.imageUrl).toBe(newImageUrlTest);
    expect(response.coach?.imagePublicID).toBe(newPublicIdTest);
  });

  test('Should update a coach with image when no previous image exists', async () => {
    mockTx.coach.update.mockResolvedValue(mockUpdatedCoach);
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://cloudinary.com/new/image.jpg',
      publicId: 'dc657980c787',
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateCoachAction({
      coachId,
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'coaches');
    expect(mockTx.coach.update).toHaveBeenCalledTimes(2);
  });

  test('Should return error when deleteImage fails', async () => {
    const imagePublicIdTest = '0c5a4d2b2d2f';
    mockTx.coach.update.mockResolvedValue({
      ...mockUpdatedCoach,
      imageUrl: 'https://cloudinary.com/old/image.jpg',
      imagePublicID: imagePublicIdTest,
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateCoachAction({
      coachId,
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
    expect(mockDeleteImage).toHaveBeenCalledWith(imagePublicIdTest);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.coach.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Coach', target: ['email'] },
      }),
    );

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.coach).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTx.coach.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Coach', target: ['teamId'] },
      }),
    );

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el entrenador/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error on unexpected error inside transaction', async () => {
    mockTx.coach.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });

  test('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updateCoachAction({
      coachId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coach).toBe(null);
  });
});
