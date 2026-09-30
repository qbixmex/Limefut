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
          aria-label="Editar banner"
          className={
            buttonVariants({
              variant: 'outline-warning',
              size: 'icon',
            })
          }
        >
          <Pencil role="img" aria-label="Icono de lápiz" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
