import { render } from '@testing-library/react';
import { SkeletonTable } from '@/app/admin/estadisticas/(components)/standings-table/skeleton-table';

describe('Tests on <SkeletonTable /> component', () => {
  test('Should render the animated placeholders', () => {
    const { container } = render(<SkeletonTable />);

    const placeholders = container.querySelectorAll('.animate-pulse');

    expect(placeholders.length).toBeGreaterThan(0);
  });
});
