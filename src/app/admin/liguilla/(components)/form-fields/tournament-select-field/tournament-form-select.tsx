'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = Readonly<{ tournaments: TOURNAMENT_TYPE[] }>;
type TOURNAMENT_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const TournamentFormSelect: FC<Props> = ({ tournaments }) => {
  const { control } = useFormContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const uniqueTournaments = [
    ...new Map(tournaments.map(t => [t.name, t])).values(),
  ];

  const setTournamentSearchParam = (tournamentPermalink: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tournament', tournamentPermalink);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Controller
      name="tournament"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Torneo</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={(tournamentPermalink) => {
              const tournament = tournaments.find(t => t.permalink === tournamentPermalink);
              if (tournament) {
                setTournamentSearchParam(tournament.permalink);
              }
              field.onChange(tournamentPermalink);
            }}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="seleccione torneo" />
            </SelectTrigger>
            <SelectContent>
              {uniqueTournaments.length > 0 ? (
                uniqueTournaments.map(({ id, name, permalink }) => (
                  <SelectItem key={id} value={permalink}>
                    {name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value='none'>
                  Aún no hay torneos disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
