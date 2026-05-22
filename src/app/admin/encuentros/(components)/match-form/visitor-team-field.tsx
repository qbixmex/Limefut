'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useFormContext, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import type { Team } from './form-types';

type Props = {
  teams: Team[];
  match: MatchType | null | undefined;
};

export const VisitorTeamField = ({ teams, match }: Props) => {
  const [open, setOpen] = useState(false);
  const { formState } = useFormContext();
  const localTeamId = useWatch({ name: 'localTeamId' });

  return (
    <FormField
      name="visitorTeamId"
      render={({ field }) => {
        const selectedTeam = teams.find((t) => t.id === field.value) ??
          (match
            ? (field.value === match.localTeam.id ? match.localTeam : match.visitorTeam)
            : undefined);

        return (
          <FormItem>
            <FormLabel>Equipo Visitante <span className="text-amber-500">*</span></FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <FormControl>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline-secondary"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      'w-full justify-between border-input dark:text-gray-300! dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
                      { 'border-destructive!': formState.errors.visitorTeamId },
                    )}
                  >
                    {selectedTeam ? selectedTeam.name : 'Selecciona un equipo'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
              </FormControl>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar equipo" className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                    <CommandGroup>
                      {teams.map((team) => (
                        <CommandItem
                          key={team.id}
                          value={team.name}
                          onSelect={(currentValue) => {
                            const selected = teams.find((t) => t.name === currentValue);
                            if (selected && selected.id === localTeamId) {
                              toast.error('Este equipo ya está seleccionado como local');
                              return;
                            }
                            if (selected) {
                              field.onChange(selected.id);
                            }
                            setOpen(false);
                          }}
                          disabled={team.id === localTeamId}
                          className={cn(
                            team.id === localTeamId && 'opacity-50 cursor-not-allowed',
                          )}
                        >
                          {team.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === team.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
