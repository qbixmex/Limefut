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
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createCoachSchema, editCoachSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Coach, Team } from '@/shared/interfaces';
import { createCoachAction, updateCoachAction } from '../(actions)';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/root/src/lib/utils';

type TeamType = Pick<Team, 'id' | 'name'>;

type Props = Readonly<{
  session: Session;
  teams: Pick<Team, 'id' | 'name'>[];
  coach?: Coach & {
    teams: TeamType[];
  };
}>;

export const CoachForm: FC<Props> = ({ session, teams, coach }) => {
  const route = useRouter();
  const formSchema = !coach ? createCoachSchema : editCoachSchema;
  const [teamsOpen, setTeamsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: coach?.name ?? '',
      email: coach?.email ?? '',
      phone: coach?.phone ?? '',
      age: coach?.age ?? 0,
      nationality: coach?.nationality ?? '',
      description: coach?.description ?? '',
      active: coach?.active ?? false,
      teamsIds: (coach?.teams && ((coach?.teams as TeamType[]).length > 0))
        ? coach?.teams.map((t) => t.id)
        : [],
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('email', data.email as string);
    formData.append('phone', data.phone as string);
    formData.append('age', (data.age as number).toString());
    formData.append('nationality', data.nationality as string);
    formData.append('description', data.description as string);
    formData.append('teamsIds', JSON.stringify(data.teamsIds));

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    formData.append('active', String(data.active ?? false));

    // Create team
    if (!coach) {
      const response = await createCoachAction(
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
        route.replace("/admin/entrenadores");
        return;
      }
      return;
    }

    if (coach) {
      const response = await updateCoachAction({
        formData,
        coachId: coach.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/entrenadores");
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

        {/* Phone and Age */}
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

        {/* Nationality and Description */}
        <div className="flex flex-col gap-5 lg:flex-row">
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
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
        </div>

        {/* Team(s) & Age & Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="teamsIds"
              render={({ field }) => {
                const selectedTeams = teams.filter((t) => field.value?.includes(t.id));
                return (
                  <FormItem>
                    <FormLabel>Equipo</FormLabel>
                    <Popover open={teamsOpen} onOpenChange={setTeamsOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={teamsOpen}
                          className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {
                            (selectedTeams.length > 0)
                              ? selectedTeams.map((t) => t.name).join(', ')
                              : "Selecciona uno ó más equipos ..."
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró el equipo.</CommandEmpty>
                            <CommandGroup>
                              {teams.map((team) => {
                                const isSelected = field.value?.includes(team.id);
                                return (
                                  <CommandItem
                                    key={team.id}
                                    value={team.name}
                                    onSelect={() => {
                                      let newValue = Array.isArray(field.value) ? [...field.value] : [];
                                      if (isSelected) {
                                        newValue = newValue.filter((id) => id !== team.id);
                                      } else {
                                        newValue.push(team.id);
                                      }
                                      form.setValue('teamsIds', newValue);
                                    }}
                                  >
                                    {team.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        isSelected ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                );
                              })}
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
              name="age"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-5">
                    <Label htmlFor="age">Edad</Label>
                    <FormControl>
                      <Input
                        id="age"
                        type="number"
                        {...field}
                        min={0}
                        max={100}
                        className="w-[100px]"
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              !coach ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default CoachForm;
