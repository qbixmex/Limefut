'use client';

import { useRef, useState, type FC, type ChangeEvent } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import { EmailInput } from './email-input';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type z from 'zod';
import { Textarea } from "@/components/ui/textarea";
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTeamSchema, editTeamSchema } from '@/shared/schemas';
import type { Coach, Team, Tournament } from '@/shared/interfaces';
import { type TournamentType, createTeamAction, updateTeamAction } from '../(actions)';
import { cn, slugify } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  tournaments: TournamentType[];
  coaches: Coach[];
  team?: Team & {
    tournament: Pick<Tournament, 'id' | 'name'> | null;
    coach: Pick<Coach, 'id' | 'name'> | null;
  };
}>;

export const TeamForm: FC<Props> = ({ session, team, tournaments, coaches }) => {
  const route = useRouter();
  const formSchema = !team ? createTeamSchema : editTeamSchema;
  const isPermalinkEdited = useRef(false);
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [coachesOpen, setCoachesOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name ?? '',
      permalink: team?.permalink ?? '',
      headquarters: team?.headquarters ?? '',
      category: team?.category ?? '',
      format: team?.format ?? '',
      gender: team?.gender ?? undefined,
      tournamentId: team?.tournament?.id ?? undefined,
      country: team?.country ?? 'México',
      state: team?.state ?? '',
      city: team?.city ?? '',
      coachId: team?.coach?.id ?? undefined,
      emails: team?.emails ?? [],
      address: team?.address ?? undefined,
      active: team?.active ?? false,
    },
  });

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('permalink', data.permalink as string);
    formData.append('headquarters', data.headquarters as string);
    formData.append('category', data.category as string);
    formData.append('format', data.format as string);
    formData.append('gender', data.gender as string);

    if (data.tournamentId) {
      formData.append('tournamentId', data.tournamentId.trim());
    }

    formData.append('country', data.country as string);
    formData.append('state', data.state as string);
    formData.append('city', data.city as string);

    if (data.coachId) {
      formData.append('coachId', data.coachId.trim());
    }

    formData.append('emails', JSON.stringify(data.emails as string[]));

    if (data.address) {
      formData.append('address', data.address.trim());
    }

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    formData.append('active', String(data.active));

    // Create team
    if (!team) {
      const response = await createTeamAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        form.reset();
        toast.success(response.message);
        route.replace(`/admin/equipos/${response.team?.id}`);
        return;
      }
      return;
    }

    // Update team
    if (team) {
      const response = await updateTeamAction({
        formData,
        teamId: team.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(`/admin/equipos/${response.team?.id}`);
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
        {/* Name and Permalink */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={handleNameChange}
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
                  <FormLabel>Enlace Permanente</FormLabel>
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

        {/* Headquarters and Image */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="headquarters"
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      value={undefined}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Division and Group */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        className={cn('w-full', {
                          'border-destructive ring-0.5 ring-destructive': form.formState.errors.format,
                        })}
                      >
                        <SelectValue placeholder="Seleccione Formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="11">11 vs 11</SelectItem>
                        <SelectItem value="9">9 vs 9</SelectItem>
                        <SelectItem value="7">7 vs 7</SelectItem>
                        <SelectItem value="5">5 vs 5</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rama</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger
                        className={cn('w-full', {
                          'border-destructive ring-0.5 ring-destructive': form.formState.errors.gender,
                        })}
                      >
                        <SelectValue placeholder="Seleccione Género" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Varonil</SelectItem>
                        <SelectItem value="female">Femenil</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tournament and Country */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="tournamentId"
              render={({ field }) => {
                const selectedTournament = tournaments.find((t) => String(t.id) === String(field.value));
                return (
                  <FormItem>
                    <FormLabel>Torneo</FormLabel>
                    <Popover open={tournamentsOpen} onOpenChange={setTournamentsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={tournamentsOpen}
                          className="w-full overflow-hidden justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {
                            field.value && selectedTournament
                              ? `${selectedTournament.name}`
                              + `, ${selectedTournament.category}`
                              + `, ${selectedTournament.format} vs ${selectedTournament.format}`
                              : "Sin torneo asignado"
                          }
                          <ChevronsUpDown className="ml_2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar torneo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el torneo.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  form.setValue('tournamentId', '');
                                  setTournamentsOpen(false);
                                }}
                              >
                                Sin torneo asignado
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
                                  value={String(tournament.id)}
                                  onSelect={(currentValue) => {
                                    const matched = tournaments.find(t => String(t.id) === String(currentValue));
                                    if (!matched) {
                                      form.setValue('tournamentId', '');
                                      setTournamentsOpen(false);
                                      return;
                                    }
                                    form.setValue(
                                      'tournamentId',
                                      (String(matched.id) === String(field.value))
                                        ? ''
                                        : String(matched.id),
                                    );
                                    setTournamentsOpen(false);
                                  }}
                                >
                                  <span>{tournament.name},</span>
                                  <span>{tournament.category},</span>
                                  <span>{tournament.format} vs {tournament.format}</span>
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      String(field.value) === String(tournament.id) ? "opacity-100" : "opacity-0",
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* State and City */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Coach and Emails */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="coachId"
              render={({ field }) => {
                const selectedCoach = coaches.find((c) => c.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Entrenador</FormLabel>
                    <Popover open={coachesOpen} onOpenChange={setCoachesOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={coachesOpen}
                          className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {field.value && selectedCoach ? selectedCoach.name : "Sin entrenador asignado"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar entrenador ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>¡ No se encontró el entrenador !</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value=""
                                onSelect={() => {
                                  form.setValue('coachId', '');
                                  setCoachesOpen(false);
                                }}
                              >
                                Sin entrenador asignado
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    !field.value ? 'opacity-100' : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                              {coaches.map((coach) => (
                                <CommandItem
                                  key={coach.id}
                                  value={coach.name}
                                  onSelect={(currentName) => {
                                    const matched = coaches.find(c => c.name === currentName);
                                    if (!matched) {
                                      form.setValue('coachId', '');
                                      setCoachesOpen(false);
                                      return;
                                    }
                                    form.setValue('coachId', matched.id === field.value ? '' : matched.id);
                                    setCoachesOpen(false);
                                  }}
                                >
                                  {coach.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === coach.id ? "opacity-100" : "opacity-0",
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
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correos Electrónicos</FormLabel>
                  <FormControl>
                    <EmailInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Escribe un email y después presiona Enter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Address and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      onChange={({ target }) => {
                        field.onChange(
                          (target.value === '')
                            ? undefined
                            : target.value,
                        );
                      }}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2 flex items-center">
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
              !team ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default TeamForm;
