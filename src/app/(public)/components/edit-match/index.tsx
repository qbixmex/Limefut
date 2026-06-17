import type { FC } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  matchId: string;
  phase: 'regular' | 'playoff';
  playoffId?: string;
}>;

export const EditMatch: FC<Props> = async ({ matchId, phase, playoffId }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  let URL = '';
  switch (phase) {
    case 'regular':
      URL = ROUTES.ADMIN_MATCHES_EDIT(matchId);
      break;
    case 'playoff':
      URL = ROUTES.ADMIN_PLAYOFFS_MATCHES_EDIT(playoffId as string, matchId);
  }

  if (!session?.user && !session?.user.roles?.includes('admin')) {
    return null;
  }

  return (
    <Link
      href={URL}
      className={cn([
        'absolute top-0 right-0',
        buttonVariants({ variant: 'outline-warning', size: 'icon' }),
      ])}
      target="_blank"
    >
      <Pencil />
    </Link>
  );
};
