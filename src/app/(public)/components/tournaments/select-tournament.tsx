'use client';

import { type FC, useState, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./styles.css";

type SelectedTournament = {
  id: string;
  name: string;
  permalink?: string;
  category: string;
  format: string;
};

type Props = Readonly<{
  tournaments: SelectedTournament[];
}>;

export const SelectTournament: FC<Props> = ({ tournaments }) => {
  const [manualShow, setManualShow] = useState<boolean>(false);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tournamentParam = searchParams?.get('torneo');
  const categoryParam = searchParams?.get('categoria');
  const formatParam = searchParams?.get('formato');

  const selectedTournament = useMemo<SelectedTournament | null>(() => {
    if (!tournamentParam || !categoryParam || !formatParam) return null;
    return tournaments.find(
      t => t.permalink === tournamentParam
      && t.category === categoryParam
      && t.format === formatParam,
    ) ?? null;
  }, [tournamentParam, categoryParam, formatParam, tournaments]);

  const showTournaments = manualShow || selectedTournament === null;

  const setTournamentIdParam = (param: {
    permalink: string;
    category: string;
    format: string;
  }) => {
    const params = new URLSearchParams();
    params.set('torneo', param.permalink);
    params.set('categoria', param.category);
    params.set('formato', param.format);
    // hide selector immediately; selection will be derived from search params
    setManualShow(false);
    router.push(`${pathname}?${params}`);
  };

  return (
    <>
      {showTournaments && (
        <h2 className="text-2xl text-sky-500 font-semibold italic">
          Seleccione un torneo
        </h2>
      )}

      {showTournaments && (
        <section className="tournaments-selector">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              role="button"
              tabIndex={0}
              className={cn('tournament', {
                'tournament-selected': selectedTournament?.id === tournament.id,
              })}
              onClick={() => {
                setTournamentIdParam({
                  permalink: tournament.permalink as string,
                  category: tournament.category,
                  format: tournament.format,
                });
              }}
            >
              <p className="tournamentName">{tournament.name}</p>
              <div className="tournamentData">
                <p><b>Categoría</b>: {tournament.category}</p>
                <p><b>Formato</b>: {`${tournament.format} vs ${tournament.format}`}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {!showTournaments && (
        <section className="w-full lg:max-w-1/4 space-y-5 mb-5">
          {pathname !== '/estadisticas' && (
            <section className="selected-tournament">
              <p className="tournamentName">{selectedTournament?.name}</p>
              <div className="tournamentData">
                <p><b>Categoría</b>: {selectedTournament?.category}</p>
                <p><b>Formato</b>: {`${selectedTournament?.format} vs ${selectedTournament?.format}`}</p>
              </div>
            </section>
          )}
          <Button
            variant="outline-primary"
            onClick={() => setManualShow(true)}
            className="w-full"
          >Cambiar Torneo</Button>
        </section>
      )}
    </>
  );
};

export default SelectTournament;