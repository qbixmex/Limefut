import { render } from '@testing-library/react';
import { PlayoffsTableSkeleton } from '@/app/admin/liguilla/(components)/playoffs-table-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <PlayoffsTableSkeleton /> component', () => {
  test('Should render the header and rows', () => {
    const { container } = render(<PlayoffsTableSkeleton />);

    const root = getRoot(container);
    const [header, body] = Array.from(root.children);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(2);
    expect(header.children).toHaveLength(4);
    expect(body.children).toHaveLength(8);
  });

  test('Should render four columns per row', () => {
    const { container } = render(<PlayoffsTableSkeleton />);

    const root = getRoot(container);
    const body = root.children[1];

    for (const row of Array.from(body.children)) {
      expect(row.children).toHaveLength(4);
    }
  });
});
