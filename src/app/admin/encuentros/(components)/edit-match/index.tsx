'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ matchId: string; }>;

export const EditMatch: FC<Props> = ({ matchId }) => {
  const searchParams = useSearchParams();

  const getURL = () => {
    const params = new URLSearchParams(searchParams);
    const sortWeek = params.get('sort-week');
    const baseURL = ROUTES.ADMIN_MATCHES_EDIT(matchId);

    if (sortWeek && sortWeek === 'unassigned') {
      params.delete('sort-week');
    }

    const queryString = params.toString();
    return queryString ? `${baseURL}?${queryString}` : baseURL;
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={getURL()}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
        >
          <Pencil />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
