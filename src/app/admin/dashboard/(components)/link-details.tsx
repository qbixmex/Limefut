'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ url: string; }>;

export const LinkDetails: FC<Props> = ({ url }) => {
  return (
    <Link href={url}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline-info" size="icon-sm">
            <InfoIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          ver detalles
        </TooltipContent>
      </Tooltip>
    </Link>
  );
};
