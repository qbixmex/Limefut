import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Pencil } from 'lucide-react';

type Props = Readonly<{ coachId: string }>;

export const EditCoach: FC<Props> = ({ coachId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_COACHES_EDIT(coachId)}
          className={
            buttonVariants({
              variant: 'outline-warning',
              size: 'icon',
            })
          }
          aria-label="Ir a editar entrenador"
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
