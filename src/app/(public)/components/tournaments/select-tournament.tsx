'use client';

import type { FC } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { cn } from "@/lib/utils";
import "./styles.css";

type Props = Readonly<{
  tournaments: {
    id: string;
    name: string;
    permalink: string;
    category: string;
    format: string;
  }[];
}>;

export const SelectTournament: FC<Props> = ({ tournaments }) => {
  const searchParams = useSearchParams();
  const sp = {
    permalink: searchParams.get('torneo'),
    category: searchParams.get('categoria'),
    format: searchParams.get('formato'),
  };
  const pathname = usePathname();
  const router = useRouter();

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
    router.push(`${pathname}?${params}`);
  };

  return (
    <>
      {!sp.permalink && !sp.category && !sp.format && (
        <h2 className="text-2xl text-sky-500 font-semibold italic">
          Seleccione un torneo
        </h2>
      )}

      <section className="tournaments">
        {tournaments.map(({ id, name, permalink, category, format }) => (
          <div
            key={id}
            role="button"
            tabIndex={0}
            className={cn('tournament', {
              'tournamentSelected': (sp.permalink === permalink)
                && (sp.category === category)
                && sp.format === format
                ,
            })}
            onClick={() => setTournamentIdParam({
              permalink,
              category,
              format,
            })}
          >
            <p className="tournamentName">{name}</p>
            <div className="tournamentData">
              <p><b>Categoría</b>: {category}</p>
              <p><b>Formato</b>: {`${format} vs ${format}`}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default SelectTournament;
