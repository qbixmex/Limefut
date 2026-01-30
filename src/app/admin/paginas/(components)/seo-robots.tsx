import type { FC } from "react";
import type { ROBOTS } from "@/shared/interfaces";
import { Badge } from "@/components/ui/badge";
import { getBadgeRobotsVariant, getRobots } from '@/lib/utils';

type Props = Readonly<{
  robots: ROBOTS;
}>;

export const SeoRobots: FC<Props> = ({ robots }) => {
  return (
    <>
      <Badge variant={getBadgeRobotsVariant(robots as ROBOTS)}>
        {getRobots(robots)}
      </Badge>
    </>
  );
};