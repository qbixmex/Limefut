import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';
import { InfoIcon } from 'lucide-react';

type Props = Readonly<{ videoId: string }>;

export const ShowVideoDetails: FC<Props> = ({ videoId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_VIDEOS_SHOW(videoId)}
          className={buttonVariants({ variant: 'outline-info', size: 'icon' })}
          aria-label="Ir a detalles del video"
        >
          <InfoIcon aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">detalles</TooltipContent>
    </Tooltip>
  );
};
