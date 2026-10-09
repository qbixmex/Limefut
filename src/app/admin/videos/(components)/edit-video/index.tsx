import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import type { FC } from 'react';

type Props = Readonly<{
  videoId: string;
}>;

export const EditVideo: FC<Props> = ({ videoId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_VIDEOS_EDIT(videoId)}
          className={buttonVariants({ variant: 'outline-warning', size: 'icon' })}
          aria-label="Ir a editar video"
        >
          <Pencil aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">editar</TooltipContent>
    </Tooltip>
  );
};
