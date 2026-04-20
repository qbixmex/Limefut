'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './team-option.css';

type Props = Readonly<{
  name: string;
  permalink: string;
}>;

export const TeamOption: FC<Props> = ({ name, permalink }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams.toString());

  const setTeamSearchParam = () => {
    if (params.has('team')) params.delete('team');
    params.set('team', permalink);
    router.replace(params.toString() ? `${pathname}?${params}` : pathname);
  };

  return (
    <Button
      variant="outline-primary"
      onClick={setTeamSearchParam}
      className={cn({
        'selected-team': params.has('team') && (params.get('team') === permalink),
      })}
    >{name}</Button>
  );
};
