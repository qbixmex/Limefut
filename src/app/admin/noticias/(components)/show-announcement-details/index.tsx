import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ announcementId: string }>;

export const ShowAnnouncementDetails: FC<Props> = ({ announcementId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_ANNOUNCEMENTS_SHOW(announcementId)}
          className={buttonVariants({ variant: 'outline-info', size: 'icon' })}
          aria-label="Ir a detalles de la noticia"
        >
          <InfoIcon aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">detalles</TooltipContent>
    </Tooltip>
  );
};
