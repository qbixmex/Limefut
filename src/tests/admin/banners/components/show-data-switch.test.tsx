import { render, screen } from '@testing-library/react';
import { ShowDataSwitch } from '@/app/admin/banners/(components)/show-data-switch';
import { updateHeroBannerShowDataAction } from '@/app/admin/banners/(actions)';

type ActiveSwitchProps = {
  resource: { id: string; state: boolean };
  updateResourceStateAction: (
    id: string,
    state: boolean,
  ) => Promise<{ ok: boolean; message: string }>;
};

const { capturedProps } = vi.hoisted(() => ({
  capturedProps: { current: null as ActiveSwitchProps | null },
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: (props: ActiveSwitchProps) => {
    capturedProps.current = props;
    return (
      <div
        data-testid="active-switch"
        data-id={props.resource.id}
        data-state={String(props.resource.state)}
      />
    );
  },
}));

vi.mock('@/app/admin/banners/(actions)', () => ({
  updateHeroBannerShowDataAction: vi.fn(),
}));

const bannerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <ShowDataSwitch /> component', () => {
  test('Should render the shared switch with the banner state', () => {
    render(<ShowDataSwitch bannerId={bannerId} showData />);

    const switchElement = screen.getByTestId('active-switch');

    expect(switchElement).toHaveAttribute('data-id', bannerId);
    expect(switchElement).toHaveAttribute('data-state', 'true');
  });

  test('Should render with hidden data state', () => {
    render(<ShowDataSwitch bannerId={bannerId} showData={false} />);

    const switchElement = screen.getByTestId('active-switch');

    expect(switchElement).toHaveAttribute('data-state', 'false');
  });

  test('Should pass the update show data action to the switch', () => {
    render(<ShowDataSwitch bannerId={bannerId} showData />);

    expect(capturedProps.current?.resource).toEqual({
      id: bannerId,
      state: true,
    });
    expect(capturedProps.current?.updateResourceStateAction).toBe(
      updateHeroBannerShowDataAction,
    );
  });
});
