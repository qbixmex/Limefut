import { render } from '@testing-library/react';
import { FieldSkeleton } from '@/app/admin/liguilla/(components)/field-skeleton';

const getRoot = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('Test on <FieldSkeleton /> component', () => {
  test('Should render the label and input placeholders', () => {
    const { container } = render(<FieldSkeleton />);

    const root = getRoot(container);

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(2);
  });
});
