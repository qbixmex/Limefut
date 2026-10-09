import { render, screen } from '@testing-library/react';
import { PagesTableSkeleton } from '@/app/admin/paginas/(components)/pages-table-skeleton';

describe('Test on <PagesTableSkeleton /> component', () => {
  test('Should render the default header and rows', () => {
    const { container } = render(<PagesTableSkeleton />);

    const root = screen.getByTestId('pages-table-skeleton');
    const [header, ...rows] = Array.from(root.children);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(13);
    expect(header.children).toHaveLength(5);
    expect(rows).toHaveLength(12);
    rows.forEach((row) => expect(row.children).toHaveLength(5));
    expect(container.firstElementChild).toBe(root);
  });
});
