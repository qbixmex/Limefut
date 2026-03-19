'use client';

import type { FC } from 'react';
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
import type { Tournament } from '~/src/shared/interfaces';

type Props = Readonly<{
  tournaments: Partial<Tournament>[];
}>;

export const TournamentsSelector: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentId = searchParams.get('torneo');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setParams = (tournamentId: string) => {
    if (params.size > 0) {
      for (const key of params.keys()) {
        if (key === 'torneo') continue;
        params.delete(key);
      }
    }

    if (tournamentId || !params.has('torneo')) {
      params.set('torneo', tournamentId.trim());
      router.push(`${pathname}?${params}`);
    }
  };

  return (
    <Select
      onValueChange={setParams}
      value={tournamentId ?? ''}
    >
      <SelectTrigger className="w-full lg:w-1/2">
        <SelectValue placeholder="¡ Seleccione una opción !" />
      </SelectTrigger>
      <SelectContent>
        {tournaments.map((tournament) => (
          <SelectItem
            key={tournament.id}
            value={tournament.id!}
          >
            {tournament.name}, {tournament.category}, {tournament.format} vs {tournament.format}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TournamentsSelector;
