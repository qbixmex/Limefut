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
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { createGallerySchema, editGallerySchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Gallery } from '@/shared/interfaces';
// import { createTournamentAction, updateTournamentAction } from '../(actions)';
import { CalendarIcon, ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Props = Readonly<{
  session: Session;
  gallery?: Gallery;
}>;

export const GalleryForm: FC<Props> = ({ session, gallery }) => {
  const route = useRouter();
  const formSchema = !gallery ? createGallerySchema : editGallerySchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: gallery?.title ?? '',
      permalink: gallery?.permalink ?? '',
      galleryDate: gallery?.galleryDate ?? new Date(),
      active: gallery?.active ?? false,
    }
  });

  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    form.getValues('galleryDate')
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('name', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('galleryDate',
      data.galleryDate
        ? (data.galleryDate as Date).toISOString()
        : new Date().toISOString()
    );
    formData.append('active', String(data.active ?? false));

    // Create gallery
    // if (!gallery) {
    //   const response = await createGalleryAction(
    //     formData,
    //     session?.user.roles ?? null
    //   );

    //   if (!response.ok) {
    //     toast.error(response.message);
    //     return;
    //   }

    //   if (response.ok) {
    //     toast.success(response.message);
    //     form.reset();
    //     route.replace("/admin/torneos");
    //     return;
    //   }
    //   return;
    // }

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
              !gallery ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default GalleryForm;
