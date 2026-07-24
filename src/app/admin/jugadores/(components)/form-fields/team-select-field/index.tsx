'use client';

import { useState, type FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type TeamType = {
  id: string;
  name: string;
};

type Props = Readonly<{
  teams: TeamType[];
}>;

export const TeamSelectField: FC<Props> = ({ teams }) => {
  const { control, setValue } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="teamId"
      control={control}
      render={({ field, fieldState }) => {
        const selectedTeam = teams.find((t) => t.id === field.value);
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Equipo</FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline-secondary"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                >
                  {selectedTeam
                    ? selectedTeam.name
                    : field.value === ''
                      ? 'Sin equipo asignado'
                      : 'Selecciona un equipo ...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key="no-team"
                        value=""
                        onSelect={() => {
                          setValue('teamId', '');
                          setOpen(false);
                        }}
                      >
                        <span className="italic text-gray-500">Sin equipo asignado</span>
                        <Check
                          className={cn(
                            'ml-auto',
                            field.value === '' ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                      {teams.map((team) => (
                        <CommandItem
                          key={team.id}
                          value={team.name}
                          onSelect={(currentValue) => {
                            const selected = teams.find((t) => t.name === currentValue);
                            if (selected) {
                              setValue('teamId', selected.id);
                            }
                            setOpen(false);
                          }}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};
