import type { FC } from 'react';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '@/shared/enums';
import { Badge } from '@/components/ui/badge';

type Props = {
  winnerTeamName: string | undefined
  matchStatus: MATCH_STATUS_TYPE,
  localScore: number;
  visitorScore: number;
};

export const WinnerTeam: FC<Props> = ({
  winnerTeamName,
  matchStatus,
  localScore,
  visitorScore,
}) => {
  if (matchStatus === MATCH_STATUS.COMPLETED) {
    if (winnerTeamName && localScore !== visitorScore) {
      return (
        <Badge variant="outline-success">
          {winnerTeamName}
        </Badge>
      );
    }
    if (localScore === visitorScore) {
      return (
        <Badge variant="outline-info">empate</Badge>
      );
    }
  }

  return (
    <Badge variant="outline-secondary">pendiente</Badge>
  );
};
