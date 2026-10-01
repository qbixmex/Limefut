import type { FC } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ messageId: string }>;

export const MessageDetails: FC<Props> = ({ messageId }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={ROUTES.ADMIN_MESSAGES_SHOW(messageId)}>
          <Button variant="outline-info" size="icon">
            <Info />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
