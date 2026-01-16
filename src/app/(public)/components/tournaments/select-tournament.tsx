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
    return tournaments.find(t => t.permalink === tournamentParam || t.id === tournamentParam) ?? null;
  }, [tournamentParam, categoryParam, formatParam, tournaments]);

  const showTournaments = manualShow || selectedTournament === null;

  const setTournamentIdParam = ({
    permalink,
    category,
    format,
  }: {
    permalink: string;
    category: string;
    format: string;
  }) => {
    const params = new URLSearchParams();
    params.set('torneo', permalink);
    params.set('categoria', category);
    params.set('formato', format);
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
          {tournaments.map(({ id, name, permalink, category, format }) => (
            <div
              key={id}
              role="button"
              tabIndex={0}
              className={cn('tournament', {
                'tournamentSelected': selectedTournament?.id === id,
              })}
              onClick={() => {
                // seleccionar torneo: actualizamos la URL; el componente se actualizará desde los search params
                setManualShow(false);
                setTournamentIdParam({
                  permalink: permalink as string,
                  category,
                  format,
                });
              }}
            >
              <p className="tournamentName">{name}</p>
              <div className="tournamentData">
                <p><b>Categoría</b>: {category}</p>
                <p><b>Formato</b>: {`${format} vs ${format}`}</p>
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