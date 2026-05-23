'use client';

import type { FC } from 'react';
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
import type { Tournament } from './form-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = Readonly<{ tournaments: Tournament[] }>;

export const TournamentSelectField: FC<Props> = ({ tournaments }) => {
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
    <FormField
      name="tournament"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Torneo</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(permalink) => {
                setTournamentSearchParam(permalink);
                field.onChange(permalink);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione un torneo" />
              </SelectTrigger>
              <SelectContent>
                {(uniqueTournaments.length > 0) ? (
                  uniqueTournaments.map(({ id, name, permalink }) => (
                    <SelectItem key={id} value={permalink}>{name}</SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value='none'>
                    Aún no hay torneos disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
