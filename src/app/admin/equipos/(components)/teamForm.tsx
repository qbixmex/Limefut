'use client';

import { useRef, useState, type FC, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { createTeamSchema, editTeamSchema } from '@/shared/schemas';
import type { Coach, Team, Tournament } from '@/shared/interfaces';
import { type TournamentType, createTeamAction, updateTeamAction } from '../(actions)';
import type { Session } from '@/lib/auth-client';
import { cn, slugify } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';
import { addTeamToStandingsAction } from '../(actions)/addTeamToStandingsAction';

type FIELD_TYPE = { id: string; name: string; };

type Props = Readonly<{
  session: Session;
  tournaments: TournamentType[];
  coaches: Coach[];
  fields: FIELD_TYPE[];
  team?: Team & {
    tournament: Pick<Tournament, 'id' | 'name'> | null;
    coach: Pick<Coach, 'id' | 'name'> | null;
    fields: FIELD_TYPE[];
  };
}>;

export const TeamForm: FC<Props> = ({
  session,
  tournaments,
  coaches,
  fields = [],
  team,
}) => {
  const route = useRouter();
  const params = useSearchParams();
  const formSchema = !team ? createTeamSchema : editTeamSchema;
  const isPermalinkEdited = useRef(false);
  const [coachesOpen, setCoachesOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  let tournamentId: string | undefined = '';

  if (team && team.tournament) {
    tournamentId = team.tournament.id;
  } else if (params.has('torneo')) {
    tournamentId = params.get('torneo') as string;
  } else {
    tournamentId = undefined;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name ?? '',
      permalink: team?.permalink ?? '',
      category: team?.category ?? '',
      format: team?.format ?? '',
      gender: team?.gender ?? '',
      tournamentId,
      country: team?.country ?? '',
      state: team?.state ?? '',
      city: team?.city ?? '',
      coachId: team?.coach?.id ?? '',
      emails: team?.emails ?? [],
      address: team?.address ?? '',
      fieldsIds: (team?.fields && team.fields.length > 0)
        ? team?.fields.map((t) => t.id)
        : [],
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
    formData.append('category', data.category as string);
    formData.append('format', data.format as string);
    formData.append('gender', data.gender as string);

    if (data.tournamentId) {
      formData.append('tournamentId', data.tournamentId.trim());
    }

    if (data.country) formData.append('country', data.country as string);
    if (data.state) formData.append('state', data.state as string);
    if (data.city) formData.append('city', data.city as string);

    if (data.coachId) {
      formData.append('coachId', data.coachId.trim());
    }

    if (data.emails) formData.append('emails', JSON.stringify(data.emails as string[]));

    if (data.address) {
      formData.append('address', data.address.trim());
    }

    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }

    if (data.fieldsIds && data.fieldsIds.length > 0) {
      formData.append('fieldsIds', JSON.stringify(data.fieldsIds));
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

      if (data.tournamentId && response.team?.id) {
        await addTeamToStandingsAction({
          tournamentId: data.tournamentId,
          teamId: response.team.id,
          userRole: session.user.roles ?? [],
        });
      }

      if (response.ok) {
        form.reset();
        toast.success(response.message);
        route.replace(
          tournamentId
            ? `${ROUTES.ADMIN_TEAMS}?torneo=${tournamentId}`
            : ROUTES.ADMIN_TEAMS,
        );
        return;
      }
    }

    // Update team
    if (team) {
      const response = await updateTeamAction({
        formData,
        teamId: team.id,
        userRoles: session.user.roles as string[],
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(
          tournamentId
            ? `${ROUTES.ADMIN_TEAMS}?torneo=${tournamentId}`
            : ROUTES.ADMIN_TEAMS,
        );
      }
    }
  };

  const handleNavigateBack = () => {
    if (team && team.tournament) {
      route.replace(`${ROUTES.ADMIN_TEAMS}?torneo=${team.tournament.id}`);
    } else if (tournamentId) {
      route.replace(`${ROUTES.ADMIN_TEAMS}?torneo=${tournamentId}`);
    } else {
      route.replace(ROUTES.ADMIN_TEAMS);
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
                    Nombre <span className="text-orange-500">*</span>
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
                  <FormLabel>
                    Enlace Permanente <span className="text-orange-500">*</span>
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

        {/* Category and Format */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Categoría <span className="text-orange-500">*</span>
                  </FormLabel>
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
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Formato <span className="text-orange-500">*</span>
                  </FormLabel>
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
        </div>

        {/* Image and Gender */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Imagen <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Rama <span className="text-orange-500">*</span>
                  </FormLabel>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Torneo</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value) => field.onChange(value || undefined)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione Torneo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {tournaments.map((tournament) => (
                            <SelectItem key={tournament.id} value={tournament.id}>
                              {tournament.name}, {tournament.category}, {tournament.format} vs {tournament.format}
                            </SelectItem>
                          ))}
                        </SelectGroup>
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    País <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
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
                  <FormLabel>
                    Estado <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
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
                  <FormLabel>
                    Ciudad <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
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
                    <FormLabel>
                      Entrenador <span className="text-gray-500">(opcional)</span>
                    </FormLabel>
                    <Popover open={coachesOpen} onOpenChange={setCoachesOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={coachesOpen}
                          className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {field.value && selectedCoach ? selectedCoach.name : 'Sin entrenador asignado'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar entrenador" className="h-9" />
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
                                      'ml-auto',
                                      field.value === coach.id ? 'opacity-100' : 'opacity-0',
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
                  <FormLabel>
                    Correos Electrónicos <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
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

        {/* Address, Fields and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dirección <span className="text-gray-500">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2 flex justify-end gap-5 items-center">
            {fields.length > 0 && (
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="fieldsIds"
                  render={({ field: input }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          Canchas <span className="text-gray-500">(opcional)</span>
                        </FormLabel>

                        <Combobox
                          multiple
                          items={fields}
                          itemToStringValue={(field) => field.name}
                          value={fields.filter((f) => input.value?.includes(f.id))}
                          onValueChange={(selectedFields) => {
                            form.setValue('fieldsIds', selectedFields.map((f) => f.id));
                          }}
                        >
                          <ComboboxChips className="w-full">
                            <ComboboxValue>
                              {(values) => (
                                <>
                                  {values.map((field: FIELD_TYPE) => (
                                    <ComboboxChip key={field.id}>
                                      {field.name}
                                    </ComboboxChip>
                                  ))}
                                </>
                              )}
                            </ComboboxValue>
                            <ComboboxChipsInput placeholder="Buscar cancha" />
                          </ComboboxChips>
                          <ComboboxContent>
                            <ComboboxEmpty>No se encontró la cancha.</ComboboxEmpty>
                            <ComboboxList>
                              {(item) => (
                                <ComboboxItem key={item.id} value={item}>
                                  {item.name}
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            )}
            <div className="ml-auto">
              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3 mt-5">
                      <Label htmlFor="active">Activo</Label>
                      <FormControl>
                        <Switch
                          id="active"
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
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
              !team ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TeamForm;
