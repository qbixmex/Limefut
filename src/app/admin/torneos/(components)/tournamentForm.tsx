'use client';

import { type ChangeEvent, useRef, useState, type FC } from 'react';
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
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createTournamentSchema, editTournamentSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Tournament } from '@/shared/interfaces';
import { createTournamentAction, updateTournamentAction } from '../(actions)';
import { ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, slugify } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  tournament?: Tournament;
}>;

export const TournamentForm: FC<Props> = ({ session, tournament }) => {
  const route = useRouter();
  const formSchema = !tournament ? createTournamentSchema : editTournamentSchema;
  const isPermalinkEdited = useRef(false);
  const [openInitDateCalendar, setOpenInitDateCalendar] = useState(false);
  const [openEndDateCalendar, setOpenEndDateCalendar] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tournament?.name ?? '',
      permalink: tournament?.permalink ?? '',
      category: tournament?.category ?? undefined,
      format: tournament?.format ?? undefined,
      country: tournament?.country ?? undefined,
      state: tournament?.state ?? undefined,
      city: tournament?.city ?? undefined,
      season: tournament?.season ?? undefined,
      description: tournament?.description ?? undefined,
      startDate: tournament?.startDate ?? undefined,
      endDate: tournament?.endDate ?? undefined,
      currentWeek: tournament?.currentWeek ?? 0,
      active: tournament?.active ?? false,
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
    if (data.category) formData.append('category', data.category as string);
    if (data.format) formData.append('format', data.format as string);
    if (data.country) formData.append('country', data.country as string);
    if (data.state) formData.append('state', data.state as string);
    if (data.city) formData.append('city', data.city as string);

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    if (data.description) formData.append('description', data.description as string);
    if (data.season) formData.append('season', data.season as string);

    formData.append('startDate',
      data.startDate
        ? (data.startDate as Date).toISOString()
        : new Date().toISOString(),
    );
    formData.append('endDate',
      data.endDate
        ? (data.endDate as Date).toISOString()
        : new Date().toISOString(),
    );
    formData.append('currentWeek', String(data.currentWeek ?? 0));
    formData.append('active', String(data.active ?? false));

    // Create tournament
    if (!tournament) {
      const response = await createTournamentAction(
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
        route.replace(`/admin/torneos/${response.tournament?.id}`);
        route.refresh();
      }
      return;
    }

    if (tournament) {
      const response = await updateTournamentAction({
        formData,
        tournamentId: tournament?.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(`/admin/torneos/${response.tournament?.id}`);
        route.refresh();
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
        {/* Name and Permalink */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre <span className="text-amber-500">*</span>
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

        {/* Division and Group */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
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
        </div>

        {/* Country and State */}
        <div className="flex flex-col gap-5 lg:flex-row">
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
        </div>

        {/* City and Season */}
        <div className="flex flex-col gap-5 lg:flex-row">
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporada</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Image and Description */}
        <div className="flex flex-col gap-5 lg:flex-row">
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

        {/* Dates and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex items-center">
            <div className="w-1/2 flex items-center gap-5">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="date-picker" className="px-1">
                      Fecha Inicial
                    </Label>
                    <Popover open={openInitDateCalendar} onOpenChange={setOpenInitDateCalendar}>
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="secondary"
                          className="w-[225px] justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
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
                          selected={field.value as Date}
                          defaultMonth={field.value as Date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenInitDateCalendar(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2 flex items-center gap-5">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="date-picker" className="px-1">
                      Fecha Final
                    </Label>
                    <Popover
                      open={openEndDateCalendar}
                      onOpenChange={setOpenEndDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="secondary"
                          className="w-[225px] justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
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
                          selected={field.value as Date}
                          defaultMonth={field.value as Date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            field.onChange(date);
                            setOpenInitDateCalendar(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-end items-center gap-5">
            <FormField
              control={form.control}
              name="currentWeek"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="currentWeek">Jornada</Label>
                    <FormControl>
                      <Input
                        type="number"
                        id="currentWeek"
                        min={0}
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-20"
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
              !tournament ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default TournamentForm;
