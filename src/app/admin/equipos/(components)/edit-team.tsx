import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ teamId: string }>;

export const EditTeam: FC<Props> = ({ teamId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_TEAM_EDIT(teamId)}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
        >
          <Pencil />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>editar</p>
      </TooltipContent>
    </Tooltip>
  );
};
