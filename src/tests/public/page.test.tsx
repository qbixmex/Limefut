import { render, screen } from '@testing-library/react';
import HomePage from '@/app/(public)/page';

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/(public)/components/hero', () => ({
  Hero: () => null,
}));

vi.mock('@/app/(public)/components/latest-results', () => ({
  LatestResults: () => null,
}));

vi.mock('@/app/(public)/components/next-matches', () => ({
  NextMatches: () => null,
}));

describe("Tests on <HomePage />", async () => {
  test("Should render the home page correctly", () => {
    render(
      <HomePage searchParams={Promise.resolve({})} />,
    );

    const title = screen.getByRole('heading', { level: 1 });

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(/limefut/i);
  });
});
