import type { FC } from 'react';
import { ActiveSwitch } from '@/shared/components/active-switch';
import { updateHeroBannerShowDataAction } from '../../(actions)';

type Props = Readonly<{
  bannerId: string;
  showData: boolean;
}>;

export const ShowDataSwitch: FC<Props> = ({ bannerId, showData }) => {
  return (
    <ActiveSwitch
      resource={{ id: bannerId, state: showData }}
      updateResourceStateAction={updateHeroBannerShowDataAction}
    />
  );
};
