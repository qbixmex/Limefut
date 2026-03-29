'use client';

import type { FC } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Session } from '@/lib/auth-client';
import type { Gallery } from '@/shared/interfaces';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useGalleryForm } from './useGalleryForm';

type Props = Readonly<{
  session: Session;
  tournamentId?: string;
  gallery?: Gallery | null;
}>;

export const GalleryForm: FC<Props> = ({ session, gallery }) => {
  const {
    form, openCalendar, selectedDate,
    setSelectedDate, setOpenCalendar, handleTitleChange, handleCancel,
    handlePermalinkChange, onSubmit,
  } = useGalleryForm({
    gallery,
    userId: session.user.id,
    roles: session.user.roles ?? [],
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Title and Permalink */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Título <span className="text-amber-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      onChange={handleTitleChange}
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

        <div className="flex flex-col gap-5 lg:flex-row">
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
                  selected={selectedDate}
                  defaultMonth={selectedDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setSelectedDate(date);
                    form.setValue('galleryDate', date as Date);
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
            onClick={handleCancel}
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
    </Form >
  );
};

export default GalleryForm;
