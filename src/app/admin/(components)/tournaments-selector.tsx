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

type Props = Readonly<{
  tournaments: {
    id: string;
    name: string;
    permalink: string;
    category: string;
  }[];
}>;

export const TournamentsSelector: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const tournamentPermalink = searchParams.get('torneo');
  const categoryPermalink = searchParams.get('categoria');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const uniqueTournaments = [
    ...new Map(tournaments.map(item => [item.name, item])).values(),
  ];

  const setTournamentParam = (tournamentPermalink: string) => {
    if (params.size > 0) {
      for (const key of params.keys()) {
        if (key === 'torneo') continue;
        params.delete(key);
      }
    }

    if (tournamentPermalink || !params.has('torneo')) {
      params.set('torneo', tournamentPermalink);
      router.push(`${pathname}?${params}`);
    }
  };

  const setCategoryParam = (category: string) => {
    if (category || !params.has('categoria')) {
      params.set('categoria', category);
      router.push(`${pathname}?${params}`);
    }
  };

  return (
    <div className="flex flex-col gap-5 mb-5">
      <Select
        value={tournamentPermalink ?? ''}
        onValueChange={setTournamentParam}
      >
        <SelectTrigger className="w-full lg:w-1/2">
          <SelectValue placeholder="Seleccione el torneo" />
        </SelectTrigger>
        <SelectContent>
          {uniqueTournaments.map((tournament) => (
            <SelectItem
              key={tournament.id}
              value={tournament.permalink}
            >
              {tournament.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {params.has('torneo') && (
        <Select
          value={categoryPermalink ?? ''}
          onValueChange={setCategoryParam}
        >
          <SelectTrigger className="w-full lg:w-1/2">
            <SelectValue placeholder="Seleccione la categoría" />
          </SelectTrigger>
          <SelectContent>
            {tournaments.map(({ id, category }) => (
              <SelectItem key={id} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
