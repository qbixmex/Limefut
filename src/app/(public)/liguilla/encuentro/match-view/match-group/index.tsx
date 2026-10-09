import type { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { MATCH_GROUP, type MATCH_GROUP_TYPE } from '@/shared/enums/match-group.enum';
import styles from './styles.module.css';

type Props = Readonly<{
  group: MATCH_GROUP_TYPE | string;
}>;

export const MatchGroup: FC<Props> = ({ group }) => {
  switch (group) {
    case MATCH_GROUP.GOLDER:
      return (
        <Badge
          variant="outline-warning"
          className={styles.goldBadge}
        >
          oro
        </Badge>
      );
    case MATCH_GROUP.SILVERED:
      return (
        <Badge
          variant="outline-warning"
          className={styles.silverBadge}
        >
          plata
        </Badge>
      );
    default:
      return (
        <Badge variant="outline-info">
          general
        </Badge>
      );
  }
};
