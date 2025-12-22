'use client';

import { useState, type ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '~/src/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '~/src/components/ui/button';
import { SendHorizonal as SendHorizontal } from 'lucide-react';

export const WeekSelector = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tournamentSearchParam = searchParams.get('torneo');
  const [week, setWeek] = useState(0);
  // await updateTeamsForWeek(weekValue);

  if (!tournamentSearchParam) return null;

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWeek(+event.target.value);
  };

  const setWeekParam = (week: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('semana', week);
    router.push(`${pathname}?${params}`);
  };

  return (
    <>
      <form onSubmit={(event) => {
        event.preventDefault();
        setWeekParam(`${week}`);
      }}>
        <div className="flex gap-5">
          <Label className="space-x-5">
            <span>Semana</span>
            <Input
              id="week"
              type="number"
              min={0}
              defaultValue={searchParams.get('semana') ?? 0}
              className="w-[75px]"
              onChange={onInputChange}
            />
          </Label>
          <Button
            variant="outline-primary"
            size="icon"
            type="submit"
          >
            <SendHorizontal />
          </Button>
        </div>
      </form>
    </>
  );
};

export default WeekSelector;