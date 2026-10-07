import { render, screen } from '@testing-library/react';

const fieldSelectProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-fields.action', () => ({
  fetchFieldsAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/field-select', () => ({
  FieldSelect: (props: unknown) => {
    fieldSelectProps.current = props;
    return <div data-testid="field-select" />;
  },
}));

import { fetchFieldsAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-fields.action';
import { FieldsSlot } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/fields-slot';
import { fieldsMock } from '../mocks/fields.mock';

describe('Test on <FieldsSlot />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fieldSelectProps.current = undefined;
  });

  test('Should fetch the fields and pass them to <FieldSelect />', async () => {
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ok: true,
      message: 'Las canchas fueron obtenidas correctamente',
      fields: fieldsMock,
    });

    const ServerComponent = await FieldsSlot({});
    render(ServerComponent);

    expect(screen.getByTestId('field-select')).toBeInTheDocument();
    expect(fieldSelectProps.current).toEqual({ fields: fieldsMock });
  });

  test('Should pass an empty list when the fetch fails', async () => {
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las canchas',
      fields: [],
    });

    const ServerComponent = await FieldsSlot({});
    render(ServerComponent);

    expect(fieldSelectProps.current).toEqual({ fields: [] });
  });
});
