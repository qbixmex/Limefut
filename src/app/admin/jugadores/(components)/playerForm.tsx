'use client';

import { useState, type FC } from 'react';
import { useRouter } from "next/navigation";
import { Session } from 'next-auth';
import { useForm } from 'react-hook-form';
import { createPlayerSchema, editPlayerSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { Player, Team } from '@/shared/interfaces';
import { createPlayerAction, updatePlayerAction } from '../(actions)';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import z from 'zod';

type TeamType = Pick<Team, 'id' | 'name'>;

type Props = Readonly<{
  session: Session;
  teams: TeamType[];
  player?: Player & {
    team: TeamType | null;
  };
}>;

export const PlayerForm: FC<Props> = ({ session, player, teams }) => {
  const route = useRouter();
  const formSchema = !player ? createPlayerSchema : editPlayerSchema;
  const [teamsOpen, setTeamOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: player?.name ?? '',
      email: player?.email ?? '',
      phone: player?.phone ?? '',
      birthday: player?.birthday ?? new Date(2000, 0, 1),
      nationality: player?.nationality ?? '',
      active: player?.active ?? false,
      teamId: player?.team?.id ?? '',
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('email', data.email as string);
    formData.append('phone', data.phone as string);
    formData.append('nationality', data.nationality as string);
    formData.append('birthday', (data.birthday as Date).toISOString());

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    formData.append('active', String(data.active ?? false));
    formData.append('teamId', data.teamId as string);

    // Create player
    if (!player) {
      const response = await createPlayerAction(
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
        route.replace("/admin/jugadores");
        return;
      }
      return;
    }

    // Update player
    if (player) {
      const response = await updatePlayerAction({
        formData,
        playerId: player.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/jugadores");
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
        {/* Name and Email */}
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Phone and Nationality */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
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
              name="nationality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nacionalidad</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Nationality and Description */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <FormLabel>Fecha de Nacimiento</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Día"
                  min={1}
                  max={31}
                  value={form.watch('birthday') ? format(form.watch('birthday') as Date, 'd') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('birthday') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setDate(parseInt(e.target.value) || 1);
                    form.setValue('birthday', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Mes"
                  min={1}
                  max={12}
                  value={form.watch('birthday') ? format(form.watch('birthday') as Date, 'M') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('birthday') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setMonth((parseInt(e.target.value) || 1) - 1);
                    form.setValue('birthday', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Año"
                  min={2000}
                  max={new Date().getFullYear()}
                  value={form.watch('birthday') ? format(form.watch('birthday') as Date, 'yyyy') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('birthday') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(e.target.value) || 2000);
                    form.setValue('birthday', newDate);
                  }}
                  className="w-24"
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-400 italic">
                  {format(form.watch('birthday') as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </span>
              </div>
            </div>
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

        {/* Team & Age & Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="teamId"
              render={({ field }) => {
                const selectedTeam = teams.find((t) => t.id === field.value);
                return (
                  <FormItem>
                    <FormLabel>Equipo</FormLabel>
                    <Popover open={teamsOpen} onOpenChange={setTeamOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={teamsOpen}
                          className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {selectedTeam
                            ? selectedTeam.name
                            : field.value === ''
                              ? "Sin equipo asignado"
                              : "Selecciona un equipo ..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                            <CommandGroup>
                              {/* Opción para dejar sin equipo */}
                              <CommandItem
                                key="no-team"
                                value=""
                                onSelect={() => {
                                  field.onChange('');
                                  form.setValue('teamId', '');
                                  setTeamOpen(false);
                                }}
                              >
                                <span className="italic text-gray-500">Sin equipo asignado</span>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === '' ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                              {/* Equipos */}
                              {teams.map((team) => (
                                <CommandItem
                                  key={team.id}
                                  value={team.name}
                                  onSelect={(currentValue) => {
                                    const selected = teams.find((t) => t.name === currentValue);
                                    if (selected) {
                                      field.onChange(selected.id);
                                      form.setValue('teamId', selected.id);
                                    }
                                    setTeamOpen(false);
                                  }}
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
          <div className="w-full lg:w-1/2 flex justify-end gap-5">
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
              !player ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default PlayerForm;
