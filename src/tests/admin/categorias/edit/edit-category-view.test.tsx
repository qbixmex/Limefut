import { render, screen } from '@testing-library/react';
import { mockCategory } from './mocks/category.mock';
import { EditCategoryView } from '@/app/admin/categorias/editar/[id]/edit-category-view';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const sessionData = vi.hoisted(() => ({
  user: {
    id: '881bf0f0-b4d4-4de1-b19e-eb9927d04d99',
    name: 'John Doe',
    username: 'johnny',
    email: 'johnny@gmail.com',
    emailVerified: true,
    image: 'johnny.webp',
    roles: ['admin'],
  },
  session: {
    userAgent: undefined,
    token: 'a41d9b460c1379bd205b1',
    createdAt: new Date('2025-01-02T00:00:00.000Z'),
    expiresAt: new Date('2025-01-02T01:00:00.000Z'),
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(sessionData),
    },
  },
}));

vi.mock('@/app/admin/categorias/(components)/edit-category-form', () => ({
  EditCategoryForm: () => <span data-testid="edit-category-form" />,
}));

const mockFetchSuccess = vi.fn().mockResolvedValue({
  ok: true,
  message: '¡ Categoría obtenida correctamente 👍 !',
  category: mockCategory,
});

vi.mock('@/app/admin/categorias/(actions)/fetch-category.action', () => ({
  fetchCategoryAction: (...args: unknown[]) => mockFetchSuccess(...args),
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <EditCategoryView />', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/lib/auth');
    sessionData.user.roles = ['admin'];
    vi.mocked(auth.api.getSession).mockResolvedValue(sessionData);

    mockFetchSuccess.mockResolvedValue({
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category: mockCategory,
    });
  });

  test('Should render correctly', async () => {
    const element = await EditCategoryView({
      params: Promise.resolve({ id: mockCategory.id }),
    });
    render(element);

    const form = screen.getByTestId('edit-category-form');

    expect(form).toBeInTheDocument();
  });

  test('Should redirect when user is not admin', async () => {
    sessionData.user.roles = ['user'];

    try {
      await EditCategoryView({
        params: Promise.resolve({ id: mockCategory.id }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });

  test('Should redirect when fetch fails', async () => {
    mockFetchSuccess.mockResolvedValue({
      ok: false,
      message: '¡ La categoría no existe !',
      category: null,
    });

    try {
      await EditCategoryView({
        params: Promise.resolve({ id: mockCategory.id }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });
});
