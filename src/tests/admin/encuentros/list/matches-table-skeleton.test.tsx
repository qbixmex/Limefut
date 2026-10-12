import { render, screen } from '@testing-library/react';
import { MatchesTableSkeleton } from '@/app/admin/encuentros/(components)/matches-table-skeleton';

const getRows = (container: HTMLElement) => {
  const root = container.firstElementChild as HTMLElement;
  return Array.from(root.children) as HTMLElement[];
};

describe('Test on <MatchesTableSkeleton /> component', () => {
  test('Should render the loading status', () => {
    render(<MatchesTableSkeleton />);

    expect(
      screen.getByRole('status', { name: /cargando encuentros/i }),
    ).toBeInTheDocument();
  });

  test('Should render the default number of rows and columns', () => {
    const { container } = render(<MatchesTableSkeleton />);

    const rows = getRows(container);

    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.children).toHaveLength(5);
    }
  });

  test('Should honor the given row and column counts', () => {
    const { container } = render(<MatchesTableSkeleton colCount={3} rowCount={4} />);

    const rows = getRows(container);

    expect(rows).toHaveLength(4);
    for (const row of rows) {
      expect(row.children).toHaveLength(3);
    }
  });
});
