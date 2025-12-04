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
import { createGalleryAction } from '../(actions)';
import { createGallerySchema, editGallerySchema } from '@/shared/schemas';
import type { Session } from 'next-auth';
import type { Gallery, Team } from '@/shared/interfaces';
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
import { cn } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  teams: { id: string; name: string; }[],
  gallery?: Gallery & { team: Pick<Team, 'id'>; };
}>;

export const GalleryForm: FC<Props> = ({ session, teams, gallery }) => {
  const route = useRouter();
  const formSchema = !gallery ? createGallerySchema : editGallerySchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery?.title ?? '',
      permalink: gallery?.permalink ?? '',
      galleryDate: gallery?.galleryDate ?? new Date(),
      teamId: gallery?.team.id ?? '',
      active: gallery?.active ?? false,
    }
  });

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('galleryDate')
  );
  const [teamsOpen, setTeamsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('galleryDate',
      data.galleryDate
        ? (data.galleryDate as Date).toISOString()
        : new Date().toISOString()
    );
    formData.append('teamId', data.teamId as string);
    formData.append('active', String(data.active ?? false));

    // Create gallery
    if (!gallery) {
      const response = await createGalleryAction(
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
        route.replace("/admin/galerias");
        return;
      }
      return;
    }

    // if (gallery) {
    //   const response = await updateGalleryAction({
    //     formData,
    //     tournamentId: gallery.id,
    //     userRoles: session.user.roles,
    //     authenticatedUserId: session?.user.id,
    //   });

    //   if (!response.ok) {
    //     toast.error(response.message);
    //     return;
    //   }

    //   if (response.ok) {
    //     toast.success(response.message);
    //     route.replace("/admin/torneos");
    //     return;
    //   }
    //   return;
    // }
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título
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
                  <FormLabel>
                    Enlace Permanente
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

        {/* Dates and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex gap-5 items-center">
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
                              : "Asigne un equipo"
                          }
                          <ChevronsUpDown className="ml_2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar equipo ..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró equipo.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  form.setValue('teamId', '');
                                  setTeamsOpen(false);
                                }}
                              >
                                Seleccione un equipo
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    field.value === '' ? 'opacity-100' : 'opacity-0'
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
                    form.setValue('galleryDate', date);
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
              !gallery ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default GalleryForm;
