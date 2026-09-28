import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';

type Props = Readonly<{ coachId: string }>;

export const ShowCoach: FC<Props> = ({ coachId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_COACHES_SHOW(coachId)}
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
        >
          <InfoIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
