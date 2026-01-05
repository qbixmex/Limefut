import { type FC } from "react";
import { cn } from "~/src/lib/utils";
import { MATCH_STATUS } from "@/shared/enums";

type Props = Readonly<{
  status: MATCH_STATUS;
}>;

const STATUS_LABELS: Record<MATCH_STATUS, string> = {
  [MATCH_STATUS.SCHEDULED]: 'programado',
  [MATCH_STATUS.COMPLETED]: 'finalizado',
  [MATCH_STATUS.INPROGRESS]: 'en progreso',
  [MATCH_STATUS.POST_POSED]: 'pospuesto',
  [MATCH_STATUS.CANCELED]: 'cancelado',
};

export const MatchStatus: FC<Props> = ({ status }) => {
  return (
    <div className={cn('italic font-semibold', {
      'text-blue-500' : status === MATCH_STATUS.SCHEDULED,
      'text-orange-500' : status === MATCH_STATUS.POST_POSED,
      'text-emerald-500' : status === MATCH_STATUS.COMPLETED,
      'text-sky-500' : status === MATCH_STATUS.INPROGRESS,
      'text-pink-500' : status === MATCH_STATUS.CANCELED,
    })}>
      {STATUS_LABELS[status] ?? 'no definido'}
    </div>
  );
};

export default MatchStatus;
