import { render } from '@testing-library/react';
import { GalleriesTableSkeleton } from '@/app/admin/galerias/(components)/galleries-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <GalleriesTableSkeleton /> component', () => {
  test('Should render the header and the rows', () => {
    const { container } = render(<GalleriesTableSkeleton />);

    const root = getRoot(container);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(13);
    expect(root.children[0].children).toHaveLength(5);
  });

  test('Should render five columns per row', () => {
    const { container } = render(<GalleriesTableSkeleton />);

    const root = getRoot(container);
    const rows = Array.from(root.children).slice(1);

    for (const row of rows) {
      expect(row.children).toHaveLength(5);
    }
  });
});
