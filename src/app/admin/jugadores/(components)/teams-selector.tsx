'use client';

import { useState, type FC } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { cn } from "~/src/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = Readonly<{
  teams: {
    id: string;
    name: string;
  }[];
}>;

export const TeamsSelector: FC<Props> = ({ teams: teams }) => {
  const searchParams = useSearchParams();
  const teamId = searchParams.get('equipo') ?? '';
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const selectedTeam = teams.find((t) => t.id === teamId);

  const setTeamIdParam = (id: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('equipo', id);
    router.push(`${pathname}?${params}`);
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline-secondary"
            role="combobox"
            aria-expanded={open}
            className="w-full md:max-w-[400px] justify-between border-input! dark:bg-input/30!"
          >
            {
              teamId !== 'none' && selectedTeam
                ? <span className="text-gray-300 italic">{selectedTeam.name}</span>
                : teamId == 'none' && !selectedTeam
                  ? <span className="text-gray-400 italic">Jugadores sin equipo asignado</span>
                  : <span className="dark:text-gray-300">Seleccione un equipo</span>
            }
            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Buscar equipo" className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontró equipo.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                    value="none"
                    onSelect={() => setTeamIdParam('none')}
                  >
                    <span className="text-gray-400 italic">Jugadores sin equipo asignado</span>
                    <Check
                      className={cn("ml-auto size-4", {
                        "opacity-100": teamId === 'none',
                        "opacity-0": teamId !== 'none',
                      })}
                    />
                  </CommandItem>
                {teams.map((team) => (
                  <CommandItem
                    key={team.id}
                    value={team.name}
                    onSelect={() => setTeamIdParam(team.id)}
                  >
                    {team.name}
                    <Check
                      className={cn("ml-auto h-4 w-4", {
                        "opacity-100": teamId === team.id,
                        "opacity-0": teamId !== team.id,
                      })}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TeamsSelector;
