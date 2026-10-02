import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';

type Props = Readonly<{ bannerId: string }>;

export const EditBanner: FC<Props> = ({ bannerId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_BANNERS_EDIT(bannerId)}
          className={
            buttonVariants({
              variant: 'outline-warning',
              size: 'icon',
            })
          }
          aria-label="Editar banner"
        >
          <Pencil aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
