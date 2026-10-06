import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ announcementId: string }>;

export const EditAnnouncement: FC<Props> = ({ announcementId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_ANNOUNCEMENTS_EDIT(announcementId)}
          className={buttonVariants({ variant: 'outline-warning', size: 'icon' })}
          aria-label="Ir a editar noticia"
        >
          <Pencil aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">editar</TooltipContent>
    </Tooltip>
  );
};
