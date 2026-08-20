'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Tournament } from './form-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{ tournaments: Tournament[] }>;

export const TournamentSelectField: FC<Props> = ({ tournaments }) => {
  const { control } = useFormContext();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const router = useRouter();
  const pathname = usePathname();

  const uniqueTournaments = [
    ...new Map(
      tournaments.map((tournament) => [tournament.name, tournament]),
    ).values(),
  ];

  const setTournamentSearchParam = (permalink: string) => {
    params.set('tournament', permalink);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Controller
      name="tournament"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Torneo</FieldLabel>
          <Select
            value={field.value}
            onValueChange={(permalink) => {
              setTournamentSearchParam(permalink);
              field.onChange(permalink);
            }}
          >
            <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
              <SelectValue placeholder="Seleccione un torneo" />
            </SelectTrigger>
            <SelectContent>
              {(uniqueTournaments.length > 0) ? (
                uniqueTournaments.map(({ id, name, permalink }) => (
                  <SelectItem key={id} value={permalink}>{name}</SelectItem>
                ))
              ) : (
                <SelectItem disabled value="none">
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
