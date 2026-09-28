import { render } from '@testing-library/react';
import { FieldsTableSkeleton } from '@/app/admin/canchas/(components)/fields-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <FieldsTableSkeleton /> component', () => {
  test('Should render default header and rows', () => {
    const { container } = render(<FieldsTableSkeleton />);

    const root = getRoot(container);
    const [header, ...rows] = Array.from(root.children);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(13);
    expect(header.children).toHaveLength(6);
    expect(rows).toHaveLength(12);
    rows.forEach((row) => expect(row.children).toHaveLength(6));
  });
});
