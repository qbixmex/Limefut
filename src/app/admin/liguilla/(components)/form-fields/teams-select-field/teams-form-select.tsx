'use client';

import { Badge } from '@/components/ui/badge';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { useSearchParams } from 'next/navigation';
import { useState, type FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{ teams: TEAM_TYPE[] }>;
type TEAM_TYPE = {
  id: string;
  name: string;
};

export const TeamsFormSelect: FC<Props> = ({ teams }) => {
  const searchParams = useSearchParams();
  const { control, setValue } = useFormContext();
  const [teamsCount, setTeamsCount] = useState(0);
  const [selectedTeams, setSelectedTeams] = useState<{ id: string; name: string; }[]>([]);
  const teamsIds = useWatch({ name: 'teamsIds' });

  const disabled = !searchParams.has('category') || teams.length === 0;

  return (
    <>
      <Controller
        name="teamsIds"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Equipos ({teamsCount})</FieldLabel>
            <Combobox
              multiple
              items={teams}
              itemToStringValue={(field) => field.name}
              value={teams.filter((t) => field.value?.includes(t.id))}
              onValueChange={(selectedTeams) => {
                setSelectedTeams(() => {
                  return selectedTeams.map((t) => ({ id: t.id, name: t.name }));
                });
                setTeamsCount(selectedTeams.length);
                setValue('teamsIds', selectedTeams.map((t) => t.id));
              }}
              disabled={disabled}
            >
              <ComboboxChips className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((field: TEAM_TYPE) => (
                        <ComboboxChip key={field.id}>
                          {field.name}
                        </ComboboxChip>
                      ))}
                    </>
                  )}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Buscar equipo" />
              </ComboboxChips>
              <ComboboxContent>
                <ComboboxEmpty>No se encontró la el equipo.</ComboboxEmpty>
                <ComboboxList className="w-full">
                  {(item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.name}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      {selectedTeams.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xl font-semibold text-sky-500 mb-2">Posiciones en liguilla</h2>
          <div className="columns-2 gap-x-4">
            {selectedTeams.map(({ id, name }, index) => (
              <div
                key={id}
                className="break-inside-avoid text-gray-500 dark:text-gray-400"
              >
                <span className="font-semibold">{index + 1}:</span>&nbsp;
                <span className="italic">{name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};
