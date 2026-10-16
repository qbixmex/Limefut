import { render } from '@testing-library/react';
import { PlayerViewSkeleton } from '@/app/admin/jugadores/perfil/[id]/player-view-skeleton';

describe('Test on <PlayerViewSkeleton /> component', () => {
  test('Should render correctly', () => {
    const { container } = render(<PlayerViewSkeleton />);

    const root = container.firstElementChild as HTMLElement;

    expect(root).toHaveClass('animate-pulse');
    expect(root.children).toHaveLength(1);
  });

  test('Should render the placeholder rows', () => {
    const { container } = render(<PlayerViewSkeleton />);

    const grid = container.querySelector('.grid') as HTMLElement;
    const rowsContainer = grid.children[1];
    const rows = Array.from(rowsContainer.children);

    expect(rows).toHaveLength(10);
    rows.forEach((row) => expect(row.children).toHaveLength(2));
  });

  test('Should render the image placeholder on the first grid cell', () => {
    const { container } = render(<PlayerViewSkeleton />);

    const grid = container.querySelector('.grid') as HTMLElement;
    const imagePlaceholder = grid.children[0];

    expect(imagePlaceholder).toHaveClass('w-full', 'h-[512px]', 'rounded');
  });
});
