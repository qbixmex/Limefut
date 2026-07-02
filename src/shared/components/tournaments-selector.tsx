'use client';

import type { FC } from 'react';
import { useEffect } from 'react';
import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Props = Readonly<{
  tournaments: {
    id: string;
    name: string;
    permalink: string;
  }[];
}>;

export const TournamentsSelector: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentPermalink = searchParams.get('tournament');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setTournamentParam = (permalink: string) => {
    if (!permalink) return;

    params.set('tournament', permalink);
    router.push(`${pathname}?${params}`);
  };

  useEffect(() => {
    if (!tournamentPermalink && tournaments.length > 0) {
      params.set('tournament', tournaments[0].permalink);
      router.replace(`${pathname}?${params}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentPermalink, tournaments, pathname, router, searchParams]);

  return (
    <div className="w-full">
      <Select
        value={tournamentPermalink ?? ''}
        onValueChange={setTournamentParam}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione torneo" />
        </SelectTrigger>
        <SelectContent>
          {tournaments.map(({ id, name }) => (
            <SelectItem key={id} value={tournamentPermalink as string}>
              { name }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
