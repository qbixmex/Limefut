import { render } from '@testing-library/react';
import { AnnouncementsTableSkeleton } from '@/app/admin/noticias/(components)/announcements-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <AnnouncementsTableSkeleton /> component', () => {
  test('Should render the header and the rows', () => {
    const { container } = render(<AnnouncementsTableSkeleton />);

    const root = getRoot(container);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(2);
    expect(root.children[0].children).toHaveLength(4);
  });

  test('Should render ten rows with four columns each', () => {
    const { container } = render(<AnnouncementsTableSkeleton />);

    const root = getRoot(container);
    const rows = Array.from(root.children[1].children);

    expect(rows).toHaveLength(10);

    for (const row of rows) {
      expect(row.children).toHaveLength(4);
    }
  });
});
