'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { TournamentType } from '@/app/(public)/(actions)';

export const useSelectorInputs = (tournaments: TournamentType[]) => {
  const searchParams = useSearchParams();
  const tournamentPermalink = searchParams.get('torneo');
  const categoryPermalink = searchParams.get('categoria');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const uniqueTournaments = [
    ...new Map(tournaments.map(item => [item.name, item])).values(),
  ];

  const setTournamentParam = (value: string) => {
    if (params.size > 0) {
      for (const key of params.keys()) {
        if (key === 'torneo') continue;
        params.delete(key);
      }
    }

    if (tournamentPermalink || !params.has('torneo')) {
      params.set('torneo', value);
      router.push(`${pathname}?${params}`);
    }
  };

  const setCategoryParam = (value: string) => {
    if (categoryPermalink || !params.has('categoria')) {
      params.set('categoria', value);
      params.set('roles', 'complete');
      router.push(`${pathname}?${params}`);
    }
  };

  const clearParams = () => {
    if (params.size > 0) {
      for (const key of params.keys()) {
        params.delete(key);
      }
    }
    router.replace(pathname);
  };

  return {
    tournamentPermalink,
    categoryPermalink,
    uniqueTournaments,
    setTournamentParam,
    setCategoryParam,
    clearParams,
  };
};
