'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { TournamentType } from '@/app/(public)/(actions)';

type ParamsState = {
  tournament: string;
  category: string;
  format: string;
};

export const useSelectorInputs = (tournaments: TournamentType[]) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [paramsState, setParamsState] = useState<ParamsState>({
    tournament: searchParams.get('torneo') ?? '',
    category: searchParams.get('categoria') ?? '',
    format: searchParams.get('formato') ?? '',
  });

  const uniqueTournaments = Array.from(
    new Map(tournaments.map(t => [t.permalink, t])).values(),
  );

  const availableTournaments = tournaments.filter(
    t => t.permalink === paramsState.tournament,
  );

  const availableFormats = Array.from(
    new Set(
      tournaments
        .filter(
          t =>
            t.permalink === paramsState.tournament &&
            t.category === paramsState.category,
        )
        .map(t => t.format),
    ),
  );

  const handleTournamentChange = (value: string) => {
    setParamsState({ tournament: value, category: '', format: '' });
  };

  const handleCategoryChange = (value: string) => {
    setParamsState(prev => ({ ...prev, category: value, format: '' }));
  };

  const handleFormatChange = (value: string) => {
    setParamsState(prev => ({ ...prev, format: value }));
  };

  useEffect(() => {
    const { tournament, category, format } = paramsState;

    if (tournament && category && format) {
      const currentTournament = searchParams.get('torneo');
      const currentCategory = searchParams.get('categoria');
      const currentFormat = searchParams.get('formato');

      if (currentTournament !== tournament || currentCategory !== category || currentFormat !== format) {
        const params = new URLSearchParams();
        params.set('torneo', tournament);
        params.set('categoria', category);
        params.set('formato', format);
        params.set('roles', 'complete');
        router.replace(`${pathname}?${params.toString()}`);
      }
    }
  }, [paramsState, pathname, router, searchParams]);

  const clearParams = () => {
    setParamsState({ tournament: '', category: '', format: '' });
    router.replace(pathname);
  };

  return {
    paramsState,
    uniqueTournaments,
    availableTournaments,
    availableFormats,
    handleTournamentChange,
    handleCategoryChange,
    handleFormatChange,
    clearParams,
  };
};
