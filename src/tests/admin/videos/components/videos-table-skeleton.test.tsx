import { render } from '@testing-library/react';
import { VideosTableSkeleton } from '@/app/admin/videos/(components)/videos-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <VideosTableSkeleton /> component', () => {
  test('Should render the header and the rows', () => {
    const { container } = render(<VideosTableSkeleton />);

    const root = getRoot(container);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(2);
    expect(root.children[0].children).toHaveLength(5);
  });

  test('Should render ten rows with five columns each', () => {
    const { container } = render(<VideosTableSkeleton />);

    const root = getRoot(container);
    const rows = Array.from(root.children[1].children);

    expect(rows).toHaveLength(10);

    for (const row of rows) {
      expect(row.children).toHaveLength(5);
    }
  });
});
