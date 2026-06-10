'use client';

import type { FC } from 'react';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updatePlayoffMatchStatusAction } from '../../(actions)/update-playoff-match-status.action';

type Props = Readonly<{
  matchId: string;
  status: MATCH_STATUS_TYPE;
}>;

export const MatchStatus: FC<Props> = ({ matchId, status }) => {
  const onUpdateStatus = async (newStatus: MATCH_STATUS_TYPE) => {
    const response = await updatePlayoffMatchStatusAction(matchId, newStatus);

    if (response.ok) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  return (
    <Select
      defaultValue={status}
      onValueChange={onUpdateStatus}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={MATCH_STATUS.IN_REVIEW}>En revisión</SelectItem>
          <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
          <SelectItem value={MATCH_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
          <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
          <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
