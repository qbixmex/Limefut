import { render } from '@testing-library/react';
import TeamsSelectorSkeletonDefault, { TeamsSelectorSkeleton } from '@/app/admin/jugadores/(components)/teams-selector-skeleton';

describe('Test on <TeamsSelectorSkeleton /> component', () => {
  test('Should render correctly', () => {
    const { container } = render(<TeamsSelectorSkeleton />);

    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(1);
  });

  test('Should render the placeholder box with the expected size', () => {
    const { container } = render(<TeamsSelectorSkeleton />);

    const placeholder = container.firstElementChild?.firstElementChild as HTMLElement;

    expect(placeholder).toHaveClass('w-full', 'max-w-[400px]', 'h-10', 'rounded-lg');
  });

  test('Should export the same component as default export', () => {
    expect(TeamsSelectorSkeletonDefault).toBe(TeamsSelectorSkeleton);
  });
});
