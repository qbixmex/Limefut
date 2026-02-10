'use client';

import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
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
import { createGallerySchema, editGallerySchema } from '@/shared/schemas';
import { createGalleryAction, updateGalleryAction } from '../(actions)';
import type { Session } from '@/lib/auth-client';
import type { Gallery } from '@/shared/interfaces';
import type z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Check,
  ChevronDownIcon,
  ChevronsUpDown,
  LoaderCircle,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { es } from "date-fns/locale";
import { cn, slugify } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  tournaments: {
    id: string;
    name: string;
    category: string;
    format: string;
  }[],
  teams: { id: string; name: string; }[],
  gallery?: Gallery & {
    tournament: { id: string; } | null,
    team: { id: string; } | null;
  };
}>;

export const GalleryForm: FC<Props> = ({ session, teams, tournaments, gallery }) => {
  const route = useRouter();
  const formSchema = !gallery ? createGallerySchema : editGallerySchema;
  const isPermalinkEdited = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery?.title ?? '',
      permalink: gallery?.permalink ?? '',
      galleryDate: gallery?.galleryDate ?? new Date(),
      tournamentId: gallery?.tournament?.id ?? undefined,
      teamId: gallery?.team?.id ?? undefined,
      active: gallery?.active ?? false,
    },
  });

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('galleryDate'),
  );
  const [selectedTournament, setSelectedTournament] = useState(!!gallery?.tournament?.id);
  const [selectedTeam, setSelectedTeam] = useState(!!gallery?.team?.id);
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [teamsOpen, setTeamsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('galleryDate',
      data.galleryDate
        ? (data.galleryDate as Date).toISOString()
        : new Date().toISOString(),
    );

    if (data.tournamentId) {
      formData.append('tournamentId', data.tournamentId as string);
    }

    if (data.teamId) {
      formData.append('teamId', data.teamId as string);
    }

    formData.append('active', String(data.active ?? false));

    // Create gallery
    if (!gallery) {
      const response = await createGalleryAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        if (!data.tournamentId) setSelectedTournament(false);
        if (!data.teamId) setSelectedTeam(false);
        route.replace(`/admin/galerias/${response.gallery?.id}`);
        return;
      }
      return;
    }

    if (gallery) {
      const response = await updateGalleryAction({
        formData,
        userRoles: session.user.roles!,
        authenticatedUserId: session?.user.id,
        galleryId: gallery.id as string,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        if (!data.tournamentId) setSelectedTournament(false);
        if (!data.teamId) setSelectedTeam(false);
        route.replace(`/admin/galerias/${response.gallery?.id}`);
        return;
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Title and Permalink */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className="text-amber-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={handleTitleChange}
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
              name="permalink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Enlace Permanente <span className="text-amber-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={handlePermalinkChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Teams and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex gap-5 items-center">
            {!selectedTournament && !selectedTeam && (
              <>
                <Label>Torneo</Label>
                <Switch
                  checked={selectedTournament}
                  onCheckedChange={setSelectedTournament}
                />
              </>
            )}
            {selectedTournament && (
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => {
                  const selectedTournament = tournaments.find((t) => t.id === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Torneo</FormLabel>
                      <Popover open={tournamentsOpen} onOpenChange={setTournamentsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={tournamentsOpen}
                            className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                          >
                            {
                              field.value && selectedTournament
                                ? `${selectedTournament.name},`
                                + ` ${selectedTournament.category}`
                                + ` ${selectedTournament.format} vs ${selectedTournament.format}`
                                : field.value === undefined
                                  ? "Sin torneo"
                                  : "Seleccione un torneo"
                            }
                            <ChevronsUpDown className="ml_2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar torneo ..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No se encontró torneo.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('tournamentId', null);
                                    setTournamentsOpen(false);
                                  }}
                                >
                                  Sin Torneo
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === '' ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                                {tournaments.map((tournament) => (
                                  <CommandItem
                                    key={tournament.id}
                                    value={tournament.name}
                                    keywords={[tournament.name]}
                                    onSelect={() => {
                                      form.setValue('tournamentId', field.value === tournament.id ? '' : tournament.id);
                                      setTournamentsOpen(false);
                                    }}
                                  >
                                    {tournament.name}, {tournament.category}, {tournament.format} vs {tournament.format}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value === tournament.id ? "opacity-100" : "opacity-0",
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
            )}
            {!selectedTeam && !selectedTournament && (
              <>
                <Label>Equipo</Label>
                <Switch
                  checked={selectedTeam}
                  onCheckedChange={setSelectedTeam}
                />
              </>
            )}
            {selectedTeam && !selectedTournament && (
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => {
                  const selectedTeam = teams.find((t) => t.id === field.value);
                  return (
                    <FormItem>
                      <FormLabel>Equipo</FormLabel>
                      <Popover open={teamsOpen} onOpenChange={setTeamsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline-secondary"
                            role="combobox"
                            aria-expanded={teamsOpen}
                            className="w-[250px] justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                          >
                            {
                              field.value && selectedTeam
                                ? selectedTeam.name
                                : field.value === undefined
                                  ? "Seleccione un equipo"
                                  : "Sin Equipo"
                            }
                            <ChevronsUpDown className="ml_2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>No se encontró Equipo</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  onSelect={() => {
                                    form.setValue('teamId', null);
                                    setTeamsOpen(false);
                                  }}
                                >
                                  Sin Equipo
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      field.value === '' ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                                {teams.map((team) => (
                                  <CommandItem
                                    key={team.id}
                                    value={team.name}
                                    keywords={[team.name]}
                                    onSelect={() => {
                                      form.setValue('teamId', field.value === team.id ? '' : team.id);
                                      setTeamsOpen(false);
                                    }}
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
            )}
          </div>
          <div className="w-full lg:w-1/2 flex items-center gap-5">
            <Label htmlFor="date-picker">
              Fecha
            </Label>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="secondary"
                  className="w-[220px] justify-between font-normal"
                >
                  {selectedDate
                    ? format(selectedDate, "d 'de' MMMM 'del' yyyy", { locale: es })
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
                    form.setValue('galleryDate', date as Date);
                    setOpenCalendar(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        id="active"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="active">Activo</Label>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => {
              setSelectedTeam(false);
              setSelectedTournament(false);
              if (gallery) {
                route.replace(`/admin/galerias/${gallery.id}`);
              } else {
                route.replace('/admin/galerias');
              }
            }}
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
              !gallery ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default GalleryForm;
