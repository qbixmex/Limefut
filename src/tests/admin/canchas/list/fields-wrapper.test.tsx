import { render, screen } from '@testing-library/react';
import { FieldsWrapper } from '@/app/admin/canchas/(components)/fields-wrapper';
import { fetchFieldsAction } from '@/app/admin/canchas/(actions)';
import { fieldsMock } from '../mocks/fields.mock';

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
}));

vi.mock('@/app/admin/canchas/(actions)', () => ({
  fetchFieldsAction: vi.fn(),
}));

vi.mock('@/app/admin/canchas/(components)/fields-table', () => ({
  FieldsTable: (props: { fields: unknown[]; roles: string[] }) => (
    <div
      data-testid="fields-table"
      data-roles={(props.roles ?? []).join(',')}
      data-count={props.fields.length}
    />
  ),
}));

describe('Tests on <FieldsWrapper />', () => {
  const defaultResponse = {
    ok: true,
    message: '! Las canchas fueron obtenidas correctamente 👍',
    fields: fieldsMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async (query = '', currentPage = 1) => {
    const ServerComponent = await FieldsWrapper({ currentPage, query });
    return render(ServerComponent);
  };

  beforeEach(() => {
    mockGetSession.mockResolvedValue({
      user: { roles: ['admin'] },
    });
    vi.mocked(fetchFieldsAction).mockResolvedValue(defaultResponse);
  });

  test('Should render the fields table with the fetched fields', async () => {
    await renderComponent();

    const table = screen.getByTestId('fields-table');

    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('data-count', String(fieldsMock.length));
    expect(table).toHaveAttribute('data-roles', 'admin');
  });

  test('Should call fetchFieldsAction with page, take and search term', async () => {
    await renderComponent('Azteca', 2);

    expect(fetchFieldsAction).toHaveBeenCalledWith({
      page: 2,
      take: 12,
      searchTerm: 'Azteca',
    });
  });

  test('Should render an empty table when there are no fields', async () => {
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ...defaultResponse,
      fields: [],
    });

    await renderComponent();

    const table = screen.getByTestId('fields-table');

    expect(table).toHaveAttribute('data-count', '0');
  });
});
