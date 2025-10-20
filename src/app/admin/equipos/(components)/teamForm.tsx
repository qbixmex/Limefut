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
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createTeamSchema, editTeamSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Coach, Team } from '@/shared/interfaces';
import { createTeamAction, updateTeamAction } from '../(actions)';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { EmailInput } from './email-input';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/root/src/lib/utils';

type Tournament = {
  id: string;
  name: string;
};

type Props = Readonly<{
  session: Session;
  tournaments: Tournament[];
  coaches: Coach[];
  team?: Team & {
    tournament: Pick<Tournament, 'id' | 'name'>;
    coach?: Pick<Coach, 'id' | 'name'>;
  };
}>;

export const TeamForm: FC<Props> = ({ session, team, tournaments, coaches }) => {
  const route = useRouter();
  const formSchema = !team ? createTeamSchema : editTeamSchema;
  const [tournamentsOpen, setTournamentsOpen] = useState(false);
  const [coachesOpen, setCoachesOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: team?.name ?? '',
      permalink: team?.permalink ?? '',
      headquarters: team?.headquarters ?? '',
      division: team?.division ?? '',
      group: team?.group ?? '',
      tournamentId: team?.tournament.id ?? '',
      country: team?.country ?? 'México',
      state: team?.state ?? '',
      city: team?.city ?? '',
      coachId: team?.coach?.id ?? '',
      emails: team?.emails ?? [],
      address: team?.address ?? '',
      active: team?.active ?? false,
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('permalink', data.permalink as string);
    formData.append('headquarters', data.headquarters as string);
    formData.append('division', data.division as string);
    formData.append('group', data.group as string);
    formData.append('tournamentId', data.tournamentId as string);
    formData.append('country', data.country as string);
    formData.append('state', data.state as string);
    formData.append('city', data.city as string);
    formData.append('coachId', data.coachId as string);
    formData.append('emails', JSON.stringify(data.emails as string[]));
    formData.append('address', data.address as string);

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    formData.append('active', String(data.active ?? false));

    // Create team
    if (!team) {
      const response = await createTeamAction(
        formData,
        session?.user.roles ?? null
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        route.replace("/admin/equipos");
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
        route.replace("/admin/equipos");
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
              name="permalink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enlace Permanente</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
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
                      type="file"
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="division"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division</FormLabel>
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
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grupo</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
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
                          {selectedTournament ? selectedTournament.name : "Selecciona un torneo ..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar torneo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el torneo.</CommandEmpty>
                            <CommandGroup>
                              {tournaments.map((tournament) => (
                                <CommandItem
                                  key={tournament.id}
                                  value={tournament.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    const selected = tournaments.find((tournament) => tournament.name === currentValue);
                                    if (selected) {
                                      form.setValue('tournamentId', selected.id);
                                    }
                                    setTournamentsOpen(false);
                                  }}
                                >
                                  {tournament.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === tournament.name ? "opacity-100" : "opacity-0"
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
                          {selectedCoach ? selectedCoach.name : "Selecciona un entrenador ..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar entrenador ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>¡ No se encontró el entrenador !</CommandEmpty>
                            <CommandGroup>
                              {coaches.map((coach) => (
                                <CommandItem
                                  key={coach.id}
                                  value={coach.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    const selected = coaches.find((coach) => coach.name === currentValue);
                                    if (selected) {
                                      form.setValue('coachId', selected.id);
                                    }
                                    setCoachesOpen(false);
                                  }}
                                >
                                  {coach.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === coach.name ? "opacity-100" : "opacity-0"
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
