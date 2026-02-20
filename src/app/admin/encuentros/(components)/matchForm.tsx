'use client';

import { useState, useEffect, type FC, Activity } from 'react';
import { fetchTeamsForMatchAction } from '../(actions)/fetchTeamsForMatchAction';
import { useRouter, useSearchParams } from 'next/navigation';
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
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createMatchSchema, editMatchSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from '@/lib/auth-client';
import { toast } from 'sonner';
import type { Match, Team } from '@/shared/interfaces';
import { createMatchAction, updateMatchAction } from '../(actions)';
import { Check, ChevronDownIcon, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MATCH_STATUS } from '@/shared/enums';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { finishMatchAction } from '../(actions)/finishMatchAction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import "./match-form.css";
import { updateMatchScoreAction } from '../(actions)/updateMatchScoreAction';

type Props = Readonly<{
  session: Session;
  initialTeams: Team[];
  tournamentId?: string;
  week?: number;
  match?: Match & {
    tournament: {
      id: string;
      name: string;
    };
  };
}>;

export const MatchForm: FC<Props> = ({
  session,
  initialTeams,
  tournamentId,
  week,
  match,
}) => {
  const searchParams = useSearchParams();
  const route = useRouter();
  const formSchema = !match ? createMatchSchema : editMatchSchema;
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [localTeamsOpen, setLocalTeamsOpen] = useState(false);
  const [visitorTeamsOpen, setVisitorTeamOpen] = useState(false);
  const [hiddenScores, setHiddenScores] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      localTeamId: match?.localTeam.id ?? '',
      localScore: match?.localScore ?? 0,
      visitorTeamId: match?.visitorTeam.id ?? '',
      visitorScore: match?.visitorScore ?? 0,
      place: match?.place ?? undefined,
      referee: match?.referee ?? undefined,
      matchDate: match?.matchDate ? new Date(match.matchDate) : new Date(),
      status: match?.status ?? MATCH_STATUS.SCHEDULED,
      week: match?.week ?? 0,
    },
  });

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(form.getValues('matchDate'));
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const initialDate = form.getValues('matchDate');
    return initialDate ? format(initialDate, 'HH:mm:ss') : '00:00:00';
  });

  useEffect(() => {
    if (match?.matchDate) {
      const d = new Date(match.matchDate);
      setSelectedDate(d);
      setSelectedTime(format(d, 'HH:mm:ss'));
      form.setValue('matchDate', d, { shouldValidate: true });
    }
  }, [match, form]);

  useEffect(() => {
    if (selectedDate) {
      const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
      const combinedDate = new Date(selectedDate);
      combinedDate.setHours(hours, minutes, seconds);
      form.setValue('matchDate', combinedDate, { shouldValidate: true });
    }
  }, [selectedDate, selectedTime, form]);

  useEffect(() => {
    const currentWeek = form.watch('week');
    if (currentWeek && currentWeek > 0 && !match) {
      updateTeamsForWeek(currentWeek);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (match && match.status === MATCH_STATUS.COMPLETED) {
      setHiddenScores(true);
    } else {
      setHiddenScores(false);
    }
  }, [match]);

  const updateTeamsForWeek = async (week: number) => {
    const response = await fetchTeamsForMatchAction({
      tournamentId: match?.tournament.id as string,
      week,
    });
    if (response.ok && response.teams) {
      setTeams(response.teams as Team[]);

      // Clear team selections if they're no longer available
      const localId = form.watch('localTeamId');
      const visitorId = form.watch('visitorTeamId');
      const availableTeamIds = new Set(response.teams.map(t => t.id));

      if (localId && !availableTeamIds.has(localId)) {
        form.setValue('localTeamId', '');
      }

      if (visitorId && !availableTeamIds.has(visitorId)) {
        form.setValue('visitorTeamId', '');
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('localTeamId', data.localTeamId as string);
    formData.append('localScore', (data.localScore as number).toString());
    formData.append('visitorTeamId', data.visitorTeamId as string);
    formData.append('visitorScore', (data.visitorScore as number).toString());
    if (data.place) formData.append('place', data.place as string);
    if (data.referee) formData.append('referee', data.referee as string);
    formData.append('matchDate', (data.matchDate as Date).toISOString());
    formData.append('status', data.status as string);
    formData.append('tournamentId', !match ? tournamentId as string : match.tournament.id);
    formData.append('week', !match ? `${week}` : `${data.week}`);

    // Reset Date and Time
    setSelectedDate(new Date());
    setSelectedTime('00:00:00');

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
        route.replace(`/admin/encuentros/detalles/${response.match?.id}`);
        return;
      }
    }

    // Update match
    if (match) {
      const response = await updateMatchAction({
        formData,
        id: match.id,
        userRoles: session.user.roles!,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(`/admin/encuentros/detalles/${match.id}`);
      }
    }
  };

  const onFinishMatch = async () => {
    const data = {
      matchId: match?.id as string,
      localScore: form.getValues('localScore') as number,
      visitorScore: form.getValues('visitorScore') as number,
      localId: match?.localTeam.id as string,
      visitorId: match?.visitorTeam.id as string,
    };

    const { ok, message } = await finishMatchAction(data);

    if (!ok) {
      toast.error(message);
      return;
    }

    if (ok) {
      toast.success(message);
      route.replace(`/admin/encuentros/detalles/${match?.id}`);
    }
  };

  const onUpdateMatchScore = async () => {
    const data = {
      matchId: match?.id as string,
      localScore: form.getValues('localScore') as number,
      visitorScore: form.getValues('visitorScore') as number,
      localId: match?.localTeam.id as string,
      visitorId: match?.visitorTeam.id as string,
    };

    const { ok, message } = await updateMatchScoreAction(data);

    if (!ok) {
      toast.error(message);
      return;
    }

    if (ok) {
      toast.success(message);
      route.replace(`/admin/encuentros/detalles/${match?.id}`);
    }
  };

  const handleNavigateBack = () => {
    const params = new URLSearchParams(searchParams);
    const baseURL = '/admin/encuentros';

    if (params.has('semana')) params.delete('semana');

    const queryString = params.toString();

    if (match) {
      route.replace(`${baseURL}`
        + `?torneo=${match.tournament.id}`
        + `&${queryString}`,
      );
    } else if (queryString.length > 0) {
      route.replace(`${baseURL}?${queryString}`);
    } else {
      route.replace(baseURL);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Local Team and Visitor Team */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="localTeamId"
              render={({ field }) => {
                const selectedTeam = teams.find((t) => t.id === field.value) ?? match?.localTeam;
                const visitorTeamId = form.watch('visitorTeamId');
                return (
                  <FormItem>
                    <FormLabel>Equipo Local <span className="text-amber-500">*</span></FormLabel>
                    <Popover open={localTeamsOpen} onOpenChange={setLocalTeamsOpen}>
                      <FormControl>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={localTeamsOpen}
                            className={cn(
                              "w-full justify-between border-input dark:text-gray-300! dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                              { "border-destructive!": form.formState.errors.localTeamId },
                            )}
                          >
                            {
                              selectedTeam
                                ? selectedTeam.name
                                : "Selecciona un equipo"
                            }
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                      </FormControl>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo" className="h-9" />
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
                                    team.id === visitorTeamId && "opacity-50 cursor-not-allowed",
                                  )}
                                >
                                  {team.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === team.id ? "opacity-100" : "opacity-0",
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
                const selectedTeam = teams.find((t) => t.id === field.value) ?? match?.visitorTeam;
                const localTeamId = form.watch('localTeamId');

                return (
                  <FormItem>
                    <FormLabel>Equipo Visitante <span className="text-amber-500">*</span></FormLabel>
                    <Popover open={visitorTeamsOpen} onOpenChange={setVisitorTeamOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={visitorTeamsOpen}
                            className={cn(
                              "w-full justify-between border-input dark:text-gray-300! dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
                              { "border-destructive!": form.formState.errors.visitorTeamId },
                            )}
                          >
                            {selectedTeam
                              ? selectedTeam.name
                              : "Selecciona un equipo"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo" className="h-9" />
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
                                    team.id === localTeamId && "opacity-50 cursor-not-allowed",
                                  )}
                                >
                                  {team.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === team.id ? "opacity-100" : "opacity-0",
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

        {/* Local Score and Visitor Score */}
        {!hiddenScores && (
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

        {/* Match Date and Week */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="date-picker" className="px-1">
                      Fecha
                    </Label>
                    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="secondary"
                          className="w-[225px] justify-between font-normal"
                        >
                          {selectedDate
                            ? format(selectedDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                            : "Selecciona Fecha"
                          }
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                          mode="single"
                          startMonth={new Date(2020, 0)}
                          endMonth={new Date(new Date().getFullYear() + 10, 11)}
                          selected={selectedDate}
                          defaultMonth={selectedDate}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setSelectedDate(date);
                            form.setValue('matchDate', date);
                            setOpenCalendar(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label htmlFor="time-picker" className="px-1">
                      Hora
                    </Label>
                    <Input
                      id="time-picker"
                      type="time"
                      step="1"
                      min="00:00:00"
                      value={selectedTime}
                      onChange={(e) => {
                        const value = !e.target.value ? '00:00:00' : e.target.value;
                        setSelectedTime(value);
                      }}
                      className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                  </div>
                </div>
              </>
            </div>
          </div>

          <div className='w-full lg:w-1/2 flex justify-end gap-5'>
            {(match?.status != 'completed') && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
                        <SelectItem value={MATCH_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
                        <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
                        <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}
            {match && (
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jornada</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        min={0}
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-[75px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
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
          <Activity mode={hiddenScores ? 'visible' : 'hidden'}>
            <Button
              type="button"
              variant="outline-info"
              onClick={() => setHiddenScores(false)}
            >
              Modificar Marcador
            </Button>
          </Activity>

          <Activity mode={(
            match?.status === MATCH_STATUS.COMPLETED
            && !hiddenScores
          ) ? 'visible' : 'hidden'}>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline-success"
                  onClick={() => { }}
                >
                  Actualizar Marcador
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-center">¿ Confirmas que quieres actualizar el marcador ?</AlertDialogTitle>
                  <AlertDialogDescription className="text-center text-emerald-500 font-bold">
                    ¡ La Tabla de Posiciones y Estadísticas serán afectadas !
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="finish-btn"
                    onClick={onUpdateMatchScore}
                  >
                    Proceder
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Activity>

          {match && (match.status !== MATCH_STATUS.COMPLETED) && (
            <div className="absolute top-5 right-5">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline-success"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                        <span className="text-sm italic">Espere</span>
                        <LoaderCircle className="size-4 animate-spin" />
                      </span>
                    ) : (
                      <span>Finalizar Encuentro</span>
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿ Confirmas que quieres finalizar el encuentro ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Al finalizar el encuentro el resultado final impactará la tabla de posiciones.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="finish-btn"
                      onClick={() => {
                        form.handleSubmit(async () => {
                          await onFinishMatch();
                        })();
                      }}
                    >
                      Proceder
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default MatchForm;
