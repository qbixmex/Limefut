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
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createTournamentSchema, editTournamentSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Tournament } from '@/shared/interfaces';
import { createTournamentAction, updateTournamentAction } from '../(actions)';
import { CalendarIcon, LoaderCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Switch } from '@/root/src/components/ui/switch';
import { Label } from '@/root/src/components/ui/label';

type Props = Readonly<{
  session: Session;
  tournament?: Tournament;
}>;

export const TournamentForm: FC<Props> = ({ session, tournament }) => {
  const route = useRouter();
  const formSchema = !tournament ? createTournamentSchema : editTournamentSchema;
  const [openStartDate, setStartDate] = useState(false);
  const [openEndDate, setEndDate] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tournament?.name ?? '',
      permalink: tournament?.permalink ?? '',
      description: tournament?.description ?? '',
      country: tournament?.country ?? '',
      state: tournament?.state ?? '',
      city: tournament?.city ?? '',
      season: tournament?.season ?? '',
      startDate: tournament?.startDate ?? new Date(),
      endDate: tournament?.endDate ?? new Date(),
      active: tournament?.active ?? false,
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.name as string);
    formData.append('permalink', data.permalink as string);
    formData.append('description', data.description as string);
    formData.append('country', data.country as string);
    formData.append('state', data.state as string);
    formData.append('city', data.city as string);
    formData.append('season', data.season as string);
    formData.append('startDate',
      data.startDate
        ? (data.startDate as Date).toISOString()
        : new Date().toISOString()
    );
    formData.append('endDate',
      data.endDate
        ? (data.endDate as Date).toISOString()
        : new Date().toISOString()
    );
    formData.append('active', String(data.active ?? false));

    // Create tournament
    if (!tournament) {
      const response = await createTournamentAction(
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
        route.replace("/admin/torneos");
        return;
      }
      return;
    }

    if (tournament) {
      const response = await updateTournamentAction({
        formData,
        tournamentId: tournament.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/torneos");
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

        {/* Dates and Description */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex items-center gap-5">
            <div className="w-1/2 flex items-center gap-5">
              <Popover open={openStartDate} onOpenChange={setStartDate}>
                <PopoverTrigger asChild>
                  <Button variant="outline-secondary">
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={(date) => field.onChange(date)}
                            className="rounded-lg border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-gray-400 italic">
                {format(form.getValues('startDate') as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
              </span>
            </div>
            <div className="w-1/2 flex items-center gap-5">
              <Popover open={openEndDate} onOpenChange={setEndDate}>
                <PopoverTrigger asChild>
                  <Button variant="outline-secondary">
                    <CalendarIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={(date) => field.onChange(date)}
                            className="rounded-lg border"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-sm text-gray-400 italic">
                {format(form.getValues('endDate') as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
              </span>
            </div>
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

        {/* Active */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            {/* Empty for alignment */}
          </div>
          <div className="w-full lg:w-1/2 flex items-center gap-5">
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
              !tournament ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default TournamentForm;
