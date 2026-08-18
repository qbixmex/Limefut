import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import PublicLayout from '@/app/(public)/layout';

vi.mock('@/app/(public)/layout-content', () => ({
  PublicLayoutContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="public-layout-content">{children}</div>
  ),
}));

describe('Tests on <PublicLayout />', () => {
  test('Should wrap its children in PublicLayoutContent', () => {
    render(
      <PublicLayout>
        <span>contenido del homepage</span>
      </PublicLayout>,
    );

    const content = screen.getByTestId('public-layout-content');
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent(/homepage/i);
  });
});
