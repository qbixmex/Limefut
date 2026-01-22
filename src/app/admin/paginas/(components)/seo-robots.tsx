import type { FC } from "react";
import type { Robots } from "@/shared/interfaces";
import { Badge } from "@/components/ui/badge";
import { getBadgeRobotsVariant, getRobots } from '@/lib/utils';

type Props = Readonly<{
  robots: Robots;
}>;

export const SeoRobots: FC<Props> = ({ robots }) => {
  return (
    <>
      <Badge variant={getBadgeRobotsVariant(robots as Robots)}>
        {getRobots(robots)}
      </Badge>
    </>
  );
};