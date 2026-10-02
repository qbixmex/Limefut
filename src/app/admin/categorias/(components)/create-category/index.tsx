import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const CreateCategory = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_CATEGORIES_CREATE}
          className={buttonVariants({
            variant: 'outline-primary',
            size: 'icon',
          })}
          aria-label="Ir a crear categoría"
        >
          <Plus strokeWidth={3} aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">crear</TooltipContent>
    </Tooltip>
  );
};
