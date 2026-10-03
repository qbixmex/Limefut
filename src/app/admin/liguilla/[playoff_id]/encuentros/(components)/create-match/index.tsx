'use client';

import { use, type FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

type Props = Readonly<{
  playoffIdPromise: Promise<string>;
}>;

export const CreateMatch: FC<Props> = ({ playoffIdPromise }) => {
  const playoffId = use(playoffIdPromise);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_MATCHES_CREATE(playoffId)}
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
          aria-label="Ir a crear encuentro"
        >
          <Plus strokeWidth={3} aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        crear encuentro
      </TooltipContent>
    </Tooltip>
  );
};
