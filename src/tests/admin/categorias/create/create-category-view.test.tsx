import { render, screen } from '@testing-library/react';
import { CreateCategoryView } from '@/app/admin/categorias/crear/create-category-view';

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

vi.mock('@/app/admin/categorias/(components)/create-category-form', () => ({
  CreateCategoryForm: () => <span data-testid="create-category-form" />,
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <CreateCategoryPage />', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/lib/auth');
    sessionData.user.roles = ['admin'];
    vi.mocked(auth.api.getSession).mockResolvedValue(sessionData);
  });

  test('Should render correctly', async () => {
    const ServerComponent = await CreateCategoryView();
    render(ServerComponent);
  });

  test('Should render <CategoryForm /> component', async () => {
    const ServerComponent = await CreateCategoryView();
    render(ServerComponent);

    expect(screen.getByTestId('create-category-form')).toBeInTheDocument();
  });

  test('Should call redirect back to categories list', async () => {
    sessionData.user.roles = ['user'];

    const adminCategoriesUrl = '/admin/categorias';
    const errorMessage = '¡ No tienes permisos administrativos para crear categorías !';

    try {
      await CreateCategoryView();
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      `${adminCategoriesUrl}?error=${encodeURIComponent(errorMessage)}`,
    );
  });
});
