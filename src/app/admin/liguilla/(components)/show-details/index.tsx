import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';

type Props = Readonly<{ playoffId: string }>;

export const ShowDetails: FC<Props> = ({ playoffId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_SHOW(playoffId)}
          className={buttonVariants({
            variant: 'outline-info',
            size: 'icon',
          })}
        >
          <InfoIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
