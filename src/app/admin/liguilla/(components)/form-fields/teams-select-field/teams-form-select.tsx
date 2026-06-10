'use client';

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
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { type FC, useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{ teams: TEAM_TYPE[] }>;
type TEAM_TYPE = {
  id: string;
  name: string;
};

export const TeamsFormSelect: FC<Props> = ({ teams }) => {
  const { control, setValue } = useFormContext();
  const teamsIds: string[] = useWatch({ name: 'teamsIds' });
  const category: string = useWatch({ name: 'category' });
  const anchorRef = useComboboxAnchor();

  const teamsMap = useMemo(() => new Map(teams.map((t) => [t.id, t])), [teams]);
  const selectedTeams = teamsIds?.length
    ? teamsIds
        .map((id) => teamsMap.get(id))
        .filter((t): t is TEAM_TYPE => !!t)
    : [] as TEAM_TYPE[];

  const teamsCount = selectedTeams.length;

  const disabled = !category || teams.length === 0;

  return (
    <div ref={anchorRef} className="w-full">
      <Controller
        name="teamsIds"
        control={control}
        render={({ fieldState }) => (
          <Field>
            <FieldLabel>Equipos ({teamsCount})</FieldLabel>
            <Combobox
              multiple
              items={teams}
              itemToStringValue={(field) => field.name}
              value={selectedTeams}
              onValueChange={(selected) => {
                const newIds = new Set<string>(selected.map((t) => t.id));
                const currentSet = new Set<string>(teamsIds ?? []);
                const removed = (teamsIds ?? []).filter((id) => !newIds.has(id));
                const added = selected
                  .filter((t) => !currentSet.has(t.id))
                  .map((t) => t.id);

                let updated = [...(teamsIds ?? [])];
                if (removed.length > 0) {
                  updated = updated.filter((id) => !removed.includes(id));
                }
                if (added.length > 0) {
                  updated.push(...added);
                }

                setValue('teamsIds', updated);
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
              <ComboboxContent anchor={anchorRef}>
                <ComboboxEmpty>No se encontró la el equipo.</ComboboxEmpty>
                <ComboboxList>
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
                <span className="font-semibold">{index + 1}:</span>
                {' '}
                <span className="italic">{name}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
