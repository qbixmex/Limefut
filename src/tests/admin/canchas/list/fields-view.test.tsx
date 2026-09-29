import { use, act } from 'react';
import { FieldsView } from '@/app/admin/canchas/(components)/fields-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/canchas/(components)/fields-table-skeleton', () => ({
  FieldsTableSkeleton: () => <div data-testid="fields-table-skeleton" />,
}));

vi.mock('@/app/admin/canchas/(components)/fields-wrapper', () => ({
  FieldsWrapper: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="fields-wrapper" />;
  },
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on FieldsView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render correctly', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await FieldsView({
      searchParamsPromise: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const wrapper = screen.getByTestId('fields-wrapper');

    expect(wrapper).toBeInTheDocument();
  });

  test('Should render skeleton while loading', async () => {
    const ServerComponent = await FieldsView({
      searchParamsPromise: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('fields-table-skeleton');

    expect(skeleton).toBeInTheDocument();
  });
});
