'use client';

import { useEffect, useState, type FC } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const [showTournaments, setShowTournaments] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<SelectedTournament | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    return () => {
      setShowTournaments(true);
      // setParams(null);
      setSelectedTournament(null);
    };
  }, []);

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
    setShowTournaments(false);
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
                setSelectedTournament({
                  id,
                  name,
                  category,
                  format,
                });
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
            onClick={() => setShowTournaments(true)}
            className="w-full"
          >Cambiar Torneo</Button>
        </section>
      )}
    </>
  );
};

export default SelectTournament;
