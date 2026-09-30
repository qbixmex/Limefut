import { use, act } from 'react';
import { BannersView } from '@/app/admin/banners/(components)/banners-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/banners/(components)/banners-table-skeleton', () => ({
  BannersTableSkeleton: () => <div data-testid="banners-table-skeleton" />,
}));

vi.mock('@/app/admin/banners/(components)/banners-wrapper', () => ({
  BannersWrapper: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="banners-wrapper" />;
  },
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on BannersView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await BannersView({
      searchParamsPromise: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const wrapper = screen.getByTestId('banners-wrapper');

    expect(wrapper).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    const ServerComponent = await BannersView({
      searchParamsPromise: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('banners-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
