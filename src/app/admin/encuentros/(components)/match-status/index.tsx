'use client';

import type { FC } from "react";
import { MATCH_STATUS } from "@/shared/enums";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateStatusAction } from "../../(actions)/updateStatusAction";
import { toast } from "sonner";

type Props = Readonly<{
  matchId: string;
  status: MATCH_STATUS;
}>;

export const MatchStatus: FC<Props> = ({ matchId, status }) => {
  const onUpdateStatus = async (newStatus: MATCH_STATUS) => {
    const response = await updateStatusAction(matchId, newStatus);

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
          <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
          <SelectItem value={MATCH_STATUS.INPROGRESS}>En Progreso</SelectItem>
          <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
          <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default MatchStatus;
