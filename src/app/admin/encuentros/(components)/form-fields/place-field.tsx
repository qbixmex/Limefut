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
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import type { Team, Field as FieldType } from './form-types';

type Props = {
  teams: Team[];
  match: MATCH_TYPE | null | undefined;
  fields?: FieldType[];
};

export const PlaceField = ({ teams, match, fields = [] }: Props) => {
  const [open, setOpen] = useState(false);
  const { control } = useFormContext();
  const localTeamId = useWatch({ name: 'localTeamId' });
  const localTeam = match?.localTeam.id === localTeamId
    ? match?.localTeam
    : teams.find(t => t.id === localTeamId);

  const availableFields = fields.length > 0
    ? fields
    : localTeam?.fields ?? [];

  return (
    <Controller
      name="fieldId"
      control={control}
      render={({ field, fieldState }) => {
        const selectedField = availableFields.find((f) => f.id === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Sede <span className="text-sm text-gray-500">(opcional)</span>
            </FieldLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline-secondary"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    'w-full justify-between border-input dark:text-gray-300! dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
                    { 'border-destructive!': fieldState.invalid },
                  )}
                >
                  {selectedField ? selectedField.name : 'Seleccione una sede'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Buscar sede" className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontró la sede.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Ninguna"
                        onSelect={() => {
                          field.onChange('');
                          setOpen(false);
                        }}
                      >
                        Ninguna
                        <Check
                          className={cn(
                            'ml-auto',
                            !field.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </CommandItem>
                      {availableFields.map((fieldItem) => (
                        <CommandItem
                          key={fieldItem.id}
                          value={fieldItem.name}
                          onSelect={(currentValue) => {
                            const selected = availableFields.find((f) => f.name === currentValue);
                            if (selected) {
                              field.onChange(selected.id);
                            }
                            setOpen(false);
                          }}
                        >
                          {fieldItem.name}
                          <Check
                            className={cn(
                              'ml-auto',
                              field.value === fieldItem.id ? 'opacity-100' : 'opacity-0',
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
