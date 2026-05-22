'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWatch } from 'react-hook-form';
import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import type { Team } from './form-types';

type Props = {
  teams: Team[];
  match: MatchType | null | undefined;
};

export const PlaceField = ({ teams, match }: Props) => {
  const localTeamId = useWatch({ name: 'localTeamId' });
  const localTeam = match?.localTeam.id === localTeamId
    ? match?.localTeam
    : teams.find(t => t.id === localTeamId);

  return (
    <FormField
      name="place"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Sede <span className="text-sm text-gray-500">(opcional)</span>
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value === 'none' ? '' : value);
              }}
              value={field.value ?? ''}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    localTeamId
                      ? 'Seleccione una sede'
                      : 'Seleccione un equipo local primero'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Ninguna</SelectItem>
                {localTeam?.fields && localTeam.fields.length > 0 ? (
                  localTeam.fields.map((fieldItem) => (
                    <SelectItem key={fieldItem.id} value={fieldItem.name}>
                      {fieldItem.name}
                    </SelectItem>
                  ))
                ) : null}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
