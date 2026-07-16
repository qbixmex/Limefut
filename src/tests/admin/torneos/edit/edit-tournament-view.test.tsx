import { render, screen } from '@testing-library/react';
import { EditTournamentView } from '@/app/admin/torneos/editar/[id]/edit-tournament-view';
import { mockTournament } from './mocks/tournament';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: ['user', 'admin'] } }),
    },
  },
}));

vi.mock('@/app/admin/torneos/editar/[id]/edit-tournament-form', () => ({
  EditTournamentForm: () => <span data-testid="edit-tournament-form" />,
}));

vi.mock('@/app/admin/torneos/(components)/form-fields/categories-select-field', () => ({
  CategorySelectField: () => null,
}));

const mockFetchSuccess = vi.fn().mockResolvedValue({
  ok: true,
  message: 'Torneo obtenido correctamente',
  tournament: mockTournament,
});

vi.mock('@/app/admin/torneos/(actions)/fetch-tournament-for-edit.action', () => ({
  fetchTournamentForEditAction: (...args: unknown[]) => mockFetchSuccess(...args),
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <EditTournamentView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchSuccess.mockResolvedValue({
      ok: true,
      message: 'Torneo obtenido correctamente',
      tournament: mockTournament,
    });
  });

  test('Should render correctly', async () => {
    const element = await EditTournamentView({
      paramsPromise: Promise.resolve({ id: 'abc-123' }),
    });
    render(element);

    const form = screen.getByTestId('edit-tournament-form');

    expect(form).toBeInTheDocument();
  });

  test('Should redirect when user is not admin', async () => {
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: {
        id: 'zJSbBRZjvcxKHqxdTGZPzjcAap8fIZZ1',
        name: 'John Doe',
        username: 'johnny',
        email: 'user@domain.com',
        emailVerified: true,
        roles: ['user'],
        image: 'john.webp',
      },
      session: {
        token: '5ns8v7qfoeZ4nB4twHAjIROvLL9Y7vVO',
        expiresAt: new Date('2026-01-01T00:00:00.000Z'),
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        userAgent: '',
      },
    });

    mockFetchSuccess.mockResolvedValue({
      ok: false,
      message: '¡ No tienes permisos administrativos para editar torneos !',
      tournament: null,
    });

    try {
      await EditTournamentView({
        paramsPromise: Promise.resolve({ id: '92d499f7-27a6-466c-a751-21b5ff3d6341' }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });

  test('Should redirect when fetch fails', async () => {
    mockFetchSuccess.mockResolvedValue({
      ok: false,
      message: '¡ El torneo no existe con el id subministrado ❌ !',
      tournament: null,
    });

    try {
      await EditTournamentView({
        paramsPromise: Promise.resolve({ id: '92d499f7-27a6-466c-a751-21b5ff3d6341' }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });
});
