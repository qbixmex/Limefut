import { render } from '@testing-library/react';
import { MessagesTableSkeleton } from '@/app/admin/mensajes/(components)/messages-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <MessagesTableSkeleton /> component', () => {
  test('Should render default header and rows', () => {
    const { container } = render(<MessagesTableSkeleton />);

    const root = getRoot(container);
    const [header, ...rows] = Array.from(root.children);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(13);
    expect(header.children).toHaveLength(4);
    expect(rows).toHaveLength(12);
    rows.forEach((row) => expect(row.children).toHaveLength(4));
  });
});
