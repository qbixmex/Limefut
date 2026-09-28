import { render, screen } from '@testing-library/react';
import { FieldsTable } from '@/app/admin/canchas/(components)/fields-table';
import { fieldsMock } from '../mocks/fields.mock';

vi.mock('@/app/admin/canchas/(components)/show-field', () => ({
  ShowField: () => <span data-testid="show-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/edit-field', () => ({
  EditField: () => <span data-testid="edit-field" />,
}));

vi.mock('@/app/admin/canchas/(components)/delete-field', () => ({
  DeleteField: () => <span data-testid="delete-field" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Tests on <FieldsTable /> component', () => {
  const defaultProps = {
    fields: fieldsMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
    roles: ['admin'],
  };

  const renderComponent = (props = defaultProps) => render(<FieldsTable {...props} />);

  test('Should render correctly', () => {
    renderComponent();

    const table = screen.getByRole('table', { name: /lista de canchas/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when no fields', () => {
    renderComponent({ ...defaultProps, fields: [] });

    const emptyMessage = screen.getByText(/aún no hay canchas de juego creadas/i);
    const table = screen.queryByRole('table', { name: /lista de canchas/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render field names', () => {
    renderComponent();

    fieldsMock.forEach((field) => {
      const fieldName = screen.getByText(field.name);
      expect(fieldName).toBeInTheDocument();
    });
  });

  test('Should render permalinks', () => {
    renderComponent();

    fieldsMock.forEach((field) => {
      const permalink = screen.getByText(field.permalink);
      expect(permalink).toBeInTheDocument();
    });
  });

  test('Should render city', () => {
    renderComponent();

    fieldsMock.forEach((field) => {
      const cities = screen.getAllByText(field.city as string);
      expect(cities.length).toBeGreaterThan(0);
    });
  });

  test('Should render state', () => {
    renderComponent();

    fieldsMock.forEach((field) => {
      const states = screen.getAllByText(field.state as string);
      expect(states.length).toBeGreaterThan(0);
    });
  });

  test('Should render country', () => {
    renderComponent();

    fieldsMock.forEach((field) => {
      const countries = screen.getAllByText(field.country as string);
      expect(countries.length).toBeGreaterThan(0);
    });
  });

  test('Should render show field action', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('show-field');

    expect(buttons).toHaveLength(fieldsMock.length);
  });

  test('Should render edit field action', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('edit-field');

    expect(buttons).toHaveLength(fieldsMock.length);
  });

  test('Should render delete field action', () => {
    renderComponent();

    const buttons = screen.getAllByTestId('delete-field');

    expect(buttons).toHaveLength(fieldsMock.length);
  });

  test('Should hide pagination when totalPages is 1', () => {
    renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).toHaveClass('hidden');
  });

  test('Should render pagination when totalPages is greater than 1', () => {
    renderComponent({
      ...defaultProps,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    const wrapper = screen.getByTestId('pagination').closest('div');
    expect(wrapper).not.toHaveClass('hidden');
  });
});
