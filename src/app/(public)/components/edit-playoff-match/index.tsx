import type { FC } from 'react';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { ROUTES } from '@/shared/constants/routes';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  playoffId: string;
  playoffMatchId: string;
}>;

export const EditPlayoffMatch: FC<Props> = async ({ playoffId, playoffMatchId }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user && !session?.user.roles?.includes('admin')) {
    return null;
  }

  return (
    <Link
      href={ROUTES.ADMIN_PLAYOFFS_MATCHES_EDIT(playoffId, playoffMatchId)}
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
