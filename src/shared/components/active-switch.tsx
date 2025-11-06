'use client';

import { startTransition, useOptimistic, type FC } from 'react';
import { Switch } from '@/root/src/components/ui/switch';
import { toast } from 'sonner';

type Props = Readonly<{
  resource: {
    id: string;
    state: boolean;
  };
  updateResourceStateAction: (
    id: string,
    state: boolean
  ) => Promise<{
    ok: boolean;
    message: string;
  }>;
}>;

export const ActiveSwitch: FC<Props> = ({ resource, updateResourceStateAction }) => {
  const [optimisticState, setOptimisticState] = useOptimistic(
    resource.state,
    (_, newState: boolean) => newState
  );

  const handleActiveSwitch = async (newState: boolean) => {
    startTransition(() => setOptimisticState(newState));

    const response = await updateResourceStateAction(resource.id, newState);

    if (!response.ok) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <Switch
      checked={optimisticState}
      onCheckedChange={handleActiveSwitch}
    />
  );
};

export default ActiveSwitch;
