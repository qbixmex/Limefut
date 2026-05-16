'use client';

import type { FC, ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createTournamentSchema, editTournamentSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { createTournamentAction, updateTournamentAction } from '../(actions)';
import { ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, slugify } from '@/lib/utils';
import type { Session } from '@/lib/auth-client';
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
import type { TournamentType } from '../(actions)/fetch-tournament.action';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  session: Session;
  tournament?: TournamentType;
  categories: Category[];
}>;

type Category = { id: string; name: string; };

export const TournamentForm: FC<Props> = ({ session, tournament, categories }) => {
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
      categoriesIds: (tournament?.categories && tournament.categories.length > 0)
        ? tournament?.categories.map((c) => c.id)
        : [],
      format: tournament?.format ?? undefined,
      gender: tournament?.gender ?? undefined,
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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('name', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', (data.name as string).trim());
    formData.append('permalink', (data.permalink as string).trim());

    if (data.categoriesIds && data.categoriesIds.length > 0) {
      formData.append('categoriesIds', JSON.stringify(data.categoriesIds));
    }
    if (data.format) {
      formData.append('format', (data.format as string).trim());
    }
    if (data.gender) {
      formData.append('gender', (data.gender as string).trim());
    }
    if (data.country) formData.append('country', (data.country as string).trim());
    if (data.state) formData.append('state', (data.state as string).trim());
    if (data.city) formData.append('city', (data.city as string).trim());
    if (data.image && typeof data.image === 'object') {
      formData.append('image', data.image);
    }
    if (data.description) {
      formData.append('description', (data.description as string).trim());
    }
    if (data.season) {
      formData.append('season', (data.season as string).trim());
    }
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

    // Create Tournament
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
        route.replace(ROUTES.ADMIN_TOURNAMENTS);
      }
      return;
    }

    if (tournament) {
      const response = await updateTournamentAction({
        formData,
        tournamentId: tournament?.id,
        userRoles: session.user.roles as string[] ?? null,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_TOURNAMENTS);
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
              name="categoriesIds"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>
                      Categorías <span className="text-gray-500">(opcional)</span>
                    </FormLabel>
                    <Combobox
                      multiple
                      items={categories}
                      itemToStringValue={(field) => field.name}
                      value={categories.filter((c) => field.value?.includes(c.id))}
                      onValueChange={(selectedCategories) => {
                        form.setValue('categoriesIds', selectedCategories.map((f) => f.id));
                      }}
                    >
                      <ComboboxChips className="w-full">
                        <ComboboxValue>
                          {(values) => (
                            <>
                              {values.map((field: Category) => (
                                <ComboboxChip key={field.id}>
                                  {field.name}
                                </ComboboxChip>
                              ))}
                            </>
                          )}
                        </ComboboxValue>
                        <ComboboxChipsInput placeholder="Buscar categoría" />
                      </ComboboxChips>
                      <ComboboxContent>
                        <ComboboxEmpty>No se encontró la categoría</ComboboxEmpty>
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
          <div className="w-full lg:w-1/2 flex flex-col lg:flex-row gap-5">
            <div className="w-full">
              <FormField
                control={form.control}
                name="format"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Formato <span className="text-gray-500">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={String(field.value ?? 'none')}
                        value={field.value ?? ''}
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
            <div className="w-full">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Género <span className="text-gray-500">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        key={String(field.value ?? 'none')}
                        value={field.value ?? ''}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className={cn('w-full', {
                            'border-destructive ring-0.5 ring-destructive': form.formState.errors.format,
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
        </div>

        {/* Country and State */}
        <div className="flex flex-col gap-5 lg:flex-row">
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
        </div>

        {/* City and Season */}
        <div className="flex flex-col gap-5 lg:flex-row">
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Temporada <span className="text-gray-500">(opcional)</span>
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

        {/* Image and Description */}
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
                  <FormLabel>
                    Descripción <span className="text-gray-500">(opcional)</span>
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
        </div>

        {/* Dates and Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex flex-col md:flex-row items-center gap-5">
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="date-picker" className="px-1">
                      Fecha Inicial <span className="text-amber-500">*</span>
                    </Label>
                    <Popover
                      open={openInitDateCalendar}
                      onOpenChange={setOpenInitDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="secondary"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                            : 'Selecciona Fecha'
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
            <div className="w-full md:w-1/2">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="date-picker" className="px-1">
                      Fecha Final <span className="text-amber-500">*</span>
                    </Label>
                    <Popover
                      open={openEndDateCalendar}
                      onOpenChange={setOpenEndDateCalendar}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          id="date-picker"
                          variant="secondary"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                            : 'Selecciona Fecha'
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
            onClick={() => {
              form.reset();
              route.back();
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
              !tournament ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TournamentForm;
