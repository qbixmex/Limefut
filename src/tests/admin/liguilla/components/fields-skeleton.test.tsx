import { render } from '@testing-library/react';
import { FieldsSkeleton } from '@/app/admin/liguilla/(components)/fields-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <FieldsSkeleton /> component', () => {
  test('Should render two field skeletons', () => {
    const { container } = render(<FieldsSkeleton />);

    const root = getRoot(container);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(2);
    for (const field of Array.from(root.children)) {
      expect(field.children).toHaveLength(2);
    }
  });
});
