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
import type { FC } from 'react';
import { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{
  teams: TEAM_TYPE[];
}>;

type TEAM_TYPE = {
  id: string;
  name: string;
};

export const TeamsFormSelect: FC<Props> = ({ teams }) => {
  const { control, setValue } = useFormContext();
  const teamsIds: string[] = useWatch({ name: 'teamsIds' });
  const anchorRef = useComboboxAnchor();

  const uniqueTeams = useMemo(() => {
    return new Map(teams.map((team) => [team.id, team]));
  }, [teams]);

  const selectedTeams = (teamsIds.length > 0)
    ? teamsIds
      .map(id => uniqueTeams.get(id))
      .filter((team): team is TEAM_TYPE => !!team)
    : [] as TEAM_TYPE[];

  return (
    <div ref={anchorRef} className="w-full">
      <Controller
        name="teamsIds"
        control={control}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Equipos ({selectedTeams.length})</FieldLabel>
            <Combobox
              multiple
              items={teams}
              itemToStringValue={(field) => field.name}
              value={selectedTeams}
              onValueChange={(selectedTeam) => {
                const newIds = new Set<string>(selectedTeam.map(({ id }) => id));
                const currentSet = new Set<string>(teamsIds ?? []);
                const removedTeams = teamsIds.filter(id => !newIds.has(id));
                const addedTeams = selectedTeam
                  .filter(team => !currentSet.has(team.id))
                  .map(team => team.id);
                let updatedTeams = [...teamsIds];
                if (removedTeams.length > 0) {
                  updatedTeams = updatedTeams.filter(id => !removedTeams.includes(id));
                }
                if (addedTeams.length > 0) updatedTeams.push(...addedTeams);
                setValue('teamsIds', updatedTeams);
              }}
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
                <ComboboxContent anchor={anchorRef}>
                  <ComboboxEmpty>No se encontró el equipo</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </ComboboxChips>
            </Combobox>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </div>
  );
};
