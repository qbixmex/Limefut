import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

export const EditCategory: FC<{ categoryId: string }> = ({ categoryId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_CATEGORIES_EDIT(categoryId)}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
        >
          <Pencil />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">editar</TooltipContent>
    </Tooltip>
  );
};
