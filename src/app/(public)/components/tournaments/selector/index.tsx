'use client';

import { Activity, type FC } from 'react';
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
import './styles.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type Props = Readonly<{
  tournaments: TournamentType[];
}>;

export const SelectorInputs: FC<Props> = ({ tournaments }) => {
  const {
    paramsState,
    uniqueTournaments,
    availableTournaments,
    availableFormats,
    handleTournamentChange,
    handleCategoryChange,
    handleFormatChange,
    clearParams,
  } = useSelectorInputs(tournaments);

  return (
    <section className="flex flex-col gap-5">
      <div className="flex gap-5 justify-between">
        <div className="w-full md:w-2/3 lg:w-[600px]">
          <Select
            value={paramsState.tournament}
            onValueChange={handleTournamentChange}
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

        {(paramsState.tournament && paramsState.category && paramsState.format) && (
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

      {paramsState.tournament && (
        <div className="w-full md:w-2/3">
          <Select
            value={paramsState.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger
              className="w-full lg:w-auto"
              id="category"
              disabled={!paramsState.tournament}
            >
              <SelectValue placeholder="Seleccione Categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableTournaments.map(({ id, category }) => (
                  <SelectItem key={id} value={category}>{category}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      {paramsState.category && (
        <div className="w-full md:w-2/3">
          <Select value={paramsState.format} onValueChange={handleFormatChange}>
            <SelectTrigger
              id="format"
              className="w-full lg:w-auto"
              disabled={!paramsState.category}
            >
              <SelectValue placeholder="Seleccione Formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format} vs {format}
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
