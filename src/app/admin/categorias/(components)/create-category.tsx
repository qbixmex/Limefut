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
        >
          <Plus
            strokeWidth={3}
            role="img"
            aria-label="Crear categoría"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">crear</TooltipContent>
    </Tooltip>
  );
};
