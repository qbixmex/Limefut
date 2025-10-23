'use client';

import { useState, type FC } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import {
  Form,
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
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createMatchSchema, editMatchSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Match, Team, Tournament } from '@/shared/interfaces';
import { createMatchAction, updateMatchAction } from '../(actions)';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MATCH_STATUS } from '@/shared/enums';
import { cn } from '@/root/src/lib/utils';

type Props = Readonly<{
  session: Session;
  teams: Team[];
  match?: Match;
  tournaments: Pick<Tournament, 'id' | 'name'>[];
}>;

export const MatchForm: FC<Props> = ({ session, teams, match, tournaments }) => {
  const route = useRouter();
  const formSchema = !match ? createMatchSchema : editMatchSchema;
  const [localTeamsOpen, setLocalTeamsOpen] = useState(false);
  const [visitorTeamsOpen, setVisitorTeamOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      localTeamId: '',
      localScore: match?.localScore ?? 0,
      visitorTeamId: '',
      visitorScore: match?.visitorScore ?? 0,
      place: match?.place ?? '',
      matchDate: match?.matchDate ?? new Date(),
      week: match?.week ?? 1,
      referee: match?.referee ?? '',
      status: match?.status ?? MATCH_STATUS.SCHEDULED,
      tournamentId: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId as string);
    formData.append('localScore', (data.localScore as number).toString());
    formData.append('visitorTeamId', data.visitorTeamId as string);
    formData.append('visitorScore', (data.visitorScore as number).toString());
    formData.append('place', data.place as string);
    formData.append('matchDate', (data.matchDate as Date).toISOString());
    formData.append('week', (data.week as number).toString());
    formData.append('referee', data.referee as string);
    formData.append('status', data.status as string);
    formData.append('tournamentId', data.tournamentId as string);

    // Create match
    if (!match) {
      const response = await createMatchAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        route.replace("/admin/encuentros");
        return;
      }
      return;
    }

    // Update match
    if (match) {
      const response = await updateMatchAction({
        formData,
        id: match.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/encuentros");
        return;
      }
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Local and Local Score */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="localTeamId"
              render={({ field }) => {
                const selectedTeam = teams.find((t) => t.id === field.value);
                const visitorTeamId = form.watch('visitorTeamId');
                return (
                  <FormItem>
                    <FormLabel>Equipo *</FormLabel>
                    <Popover open={localTeamsOpen} onOpenChange={setLocalTeamsOpen}>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={localTeamsOpen}
                            className={cn(
                              "w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                              { "border-destructive!": form.formState.errors.localTeamId }
                            )}
                          >
                            {selectedTeam
                              ? selectedTeam.name
                              : "Selecciona un equipo ..."
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                            <CommandGroup>
                              {teams.map((team) => (
                                <CommandItem
                                  key={team.id}
                                  value={team.name}
                                  onSelect={(currentValue) => {
                                    const selected = teams.find((t) => t.name === currentValue);
                                    // Validate if team is already selected as visitor
                                    if (selected && selected.id === visitorTeamId) {
                                      toast.error("Este equipo ya está seleccionado como visitante");
                                      return;
                                    }
                                    if (selected) {
                                      field.onChange(selected.id);
                                      form.setValue('localTeamId', selected.id);
                                    }
                                    setLocalTeamsOpen(false);
                                  }}
                                  disabled={team.id === visitorTeamId}
                                  className={cn(
                                    team.id === visitorTeamId && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  {team.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === team.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="visitorTeamId"
              render={({ field }) => {
                const selectedTeam = teams.find((t) => t.id === field.value);
                const localTeamId = form.watch('localTeamId');

                return (
                  <FormItem>
                    <FormLabel>Equipo Visitante *</FormLabel>
                    <Popover open={visitorTeamsOpen} onOpenChange={setVisitorTeamOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={visitorTeamsOpen}
                            className={cn(
                              "w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                              { "border-destructive!": form.formState.errors.visitorTeamId }
                            )}
                          >
                            {selectedTeam
                              ? selectedTeam.name
                              : "Selecciona un equipo ..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                            <CommandGroup>
                              {teams.map((team) => (
                                <CommandItem
                                  key={team.id}
                                  value={team.name}
                                  onSelect={(currentValue) => {
                                    const selected = teams.find((t) => t.name === currentValue);
                                    if (selected && selected.id === localTeamId) {
                                      toast.error("Este equipo ya está seleccionado como local");
                                      return;
                                    }
                                    if (selected) {
                                      field.onChange(selected.id);
                                      form.setValue('visitorTeamId', selected.id);
                                    }
                                    setVisitorTeamOpen(false);
                                  }}
                                  disabled={team.id === localTeamId}
                                  className={cn(
                                    team.id === localTeamId && "opacity-50 cursor-not-allowed"
                                  )}
                                >
                                  {team.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === team.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>

        {/* Visitor and Visitor Score */}
        {match && (
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="localScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marcador Local</FormLabel>
                    <FormControl>
                      <Input
                        id="localScore"
                        type="number"
                        {...field}
                        min={0}
                        max={50}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full lg:w-[75px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="visitorScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marcador Visitante</FormLabel>
                    <FormControl>
                      <Input
                        id="visitorScore"
                        type="number"
                        {...field}
                        min={0}
                        max={50}
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full lg:w-[75px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {/* Place and week */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="referee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arbitro</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Match Date and Referee */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <FormLabel>Fecha del encuentro</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Día"
                  min={1}
                  max={31}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'd') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setDate(parseInt(e.target.value) || 1);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Mes"
                  min={1}
                  max={12}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'M') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setMonth((parseInt(e.target.value) || 1) - 1);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Año"
                  min={2000}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'yyyy') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(e.target.value) || 2000);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-24"
                />
                <FormField
                  control={form.control}
                  name="matchDate"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-400 italic">
                  {format(form.watch('matchDate') as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-end gap-5">
            <div>
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Torneo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un torneo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournaments.map(({ id, name }) => (
                          <SelectItem key={id} value={id as string}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jornada</FormLabel>
                    <FormControl>
                      <Input
                        id="week"
                        type="number"
                        {...field}
                        min={1}
                        max={100}
                        className="w-[75px]"
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
                        <SelectItem value={MATCH_STATUS.INPROGRESS}>En Progreso</SelectItem>
                        <SelectItem value={MATCH_STATUS.COMPLETED}>Finalizado</SelectItem>
                        <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
                        <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.back()}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              !match ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default MatchForm;
