'use client';

import { type FC } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { TournamentType } from '../../../(actions)';
import { useSelectorInputs } from './use-selector-inputs';
import { FunnelX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import style from './styles.module.css';

type Props = Readonly<{
  tournaments: TournamentType[];
  roles?: boolean;
}>;

export const SelectorInputs: FC<Props> = ({ tournaments, roles }) => {
  const {
    uniqueTournaments,
    tournamentPermalink,
    categoryPermalink,
    setTournamentParam,
    setCategoryParam,
    clearParams,
  } = useSelectorInputs(tournaments, roles);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex gap-5 justify-between">
        <div className={style.tournamentsSelector}>
          <Select
            value={tournamentPermalink ?? ''}
            onValueChange={setTournamentParam}
          >
            <SelectTrigger id="permalink" className="w-full">
              <SelectValue placeholder="Seleccione Torneo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {uniqueTournaments.map(({ id, name, permalink }) => (
                  <SelectItem key={id} value={permalink}>{name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {(tournamentPermalink && categoryPermalink) && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline-info"
                onClick={clearParams}
              >
                <FunnelX />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Limpiar Filtros</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {tournamentPermalink && (
        <div className={style.categoriesSelector}>
          <Select
            value={categoryPermalink ?? ''}
            onValueChange={setCategoryParam}
          >
            <SelectTrigger
              id="category"
              disabled={!tournamentPermalink}
              className="w-full"
            >
              <SelectValue placeholder="Seleccione Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tournaments.map(({ id, category }) => (
                  <SelectItem key={id} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}
    </section>
  );
};
