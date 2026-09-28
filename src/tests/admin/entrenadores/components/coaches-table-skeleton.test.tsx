import { render } from '@testing-library/react';
import { CoachesTableSkeleton } from '@/app/admin/entrenadores/(components)/coaches-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <CoachesTableSkeleton /> component', () => {
  test('Should render default header and rows', () => {
    const { container } = render(<CoachesTableSkeleton />);

    const root = getRoot(container);
    const [header, ...rows] = Array.from(root.children);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(3);
    expect(header.children).toHaveLength(5);
    expect(rows).toHaveLength(2);
    rows.forEach((row) => expect(row.children).toHaveLength(5));
  });

  test('Should render with custom colCount and rowCount', () => {
    const { container } = render(
      <CoachesTableSkeleton colCount={7} rowCount={6} />,
    );

    const root = getRoot(container);
    const [header, ...rows] = Array.from(root.children);

    expect(root.children).toHaveLength(7);
    expect(header.children).toHaveLength(7);
    expect(rows).toHaveLength(6);
    rows.forEach((row) => expect(row.children).toHaveLength(7));
  });

  test('Should build the grid template from colCount', () => {
    const { container } = render(<CoachesTableSkeleton colCount={7} />);

    const root = getRoot(container);
    const header = root.children[0] as HTMLElement;

    expect(header).toHaveStyle({ gridTemplateColumns: '80px repeat(5,1fr) 200px' });
  });

  test('Should render the first column cell taller than the rest', () => {
    const { container } = render(<CoachesTableSkeleton />);

    const root = getRoot(container);
    const firstRow = root.children[1];
    const cells = Array.from(firstRow.children);

    expect(cells[0]).toHaveClass('h-20');
    cells.slice(1).forEach((cell) => expect(cell).toHaveClass('h-5'));
  });
});
