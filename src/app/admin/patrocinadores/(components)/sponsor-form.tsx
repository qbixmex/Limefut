'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import { createSponsorSchema, editSponsorSchema } from '@/shared/schemas';
import { createSponsorAction, updateSponsorAction } from '../(actions)';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from '@/lib/auth-client';
import { toast } from 'sonner';
import type { Sponsor } from '@/shared/interfaces';
import { ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select';
import { ROUTES } from '@/shared/constants/routes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { SPONSOR_ALIGNMENT } from '@/shared/enums/sponsor-alignment';
import { getAlignment } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  sponsor?: Sponsor;
}>;

export const SponsorForm: FC<Props> = ({ session, sponsor }) => {
  const route = useRouter();
  const formSchema = !sponsor ? createSponsorSchema : editSponsorSchema;
  const [openStartDateCalendar, setOpenStartDateCalendar] = useState(false);
  const [openEndDateCalendar, setOpenEndDateCalendar] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sponsor?.name ?? '',
      url: sponsor?.url ?? undefined,
      startDate: sponsor?.startDate ?? undefined,
      endDate: sponsor?.endDate ?? undefined,
      position: sponsor?.position ?? 1,
      alignment: sponsor?.alignment ?? '',
      clicks: sponsor?.clicks ?? 0,
      active: sponsor?.active ?? false,
    },
  });

  const [selectedStartDate, setSelectedStartDate] = useState<Date | undefined>(
    form.getValues('startDate'),
  );
  const [selectedEndDate, setSelectedEndDate] = useState<Date | undefined>(
    form.getValues('endDate'),
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('name', data.name as string);
    if (data.url) formData.append('url', data.url as string);
    if (data.startDate) formData.append('startDate', (data.startDate as Date).toString());
    if (data.endDate) formData.append('endDate', (data.endDate as Date).toString());
    if (data.image) formData.append('image', data.image as File);
    formData.append('alignment', data.alignment as string ?? '');
    if (data.position) formData.append('position', String(data.position ?? 0));
    if (data.clicks) formData.append('clicks', data.clicks.toString());
    formData.append('active', String(data.active ?? false));

    // Create Sponsor
    if (!sponsor) {
      const response = await createSponsorAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_SPONSORS);
      }
      return;
    }

    // Update Sponsor
    if (sponsor) {
      const response = await updateSponsorAction({
        formData,
        sponsorId: sponsor?.id as string,
        userRoles: session.user.roles!,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      route.replace(ROUTES.ADMIN_SPONSORS);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Title and URL */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1 flex flex-col lg:flex-row gap-5 lg:gap-3">
            <div className="flex-1 flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Fecha Inicial
              </Label>
              <Popover open={openStartDateCalendar} onOpenChange={setOpenStartDateCalendar}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-picker"
                    variant="secondary"
                    className="justify-between font-normal"
                  >
                    {selectedStartDate
                      ? format(selectedStartDate, "d 'de' MMMM 'del' yyyy", { locale: es })
                      : 'Seleccione fecha inicial'
                    }
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    selected={selectedStartDate}
                    defaultMonth={selectedStartDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setSelectedStartDate(date);
                      form.setValue('startDate', date);
                      setOpenStartDateCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-1 flex flex-col gap-3">
              <Label htmlFor="date-picker" className="px-1">
                Fecha Final
              </Label>
              <Popover open={openEndDateCalendar} onOpenChange={setOpenEndDateCalendar}>
                <PopoverTrigger asChild>
                  <Button id="date-picker" variant="secondary" className="justify-between font-normal">
                    {selectedEndDate
                      ? format(selectedEndDate, "d 'de' MMMM 'del' yyyy", { locale: es })
                      : 'Seleccione fecha final'
                    }
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    selected={selectedEndDate}
                    defaultMonth={selectedEndDate}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setSelectedEndDate(date);
                      form.setValue('endDate', date);
                      setOpenEndDateCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Imagen <span className="text-amber-500">*</span>
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
        </section>

        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            {sponsor && (
              <FormField
                control={form.control}
                name="clicks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clicks</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        value={field.value ?? '0'}
                        onChange={(e) => {
                          const clicks = parseInt(e.target.value);
                          field.onChange(clicks);
                        }}
                        className="w-16"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <div className="w-full flex items-center lg:justify-end gap-5">
            <div className="w-full lg:w-auto lg:mt-5">
              <FormField
                control={form.control}
                name="alignment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full lg:w-auto"
                          aria-invalid={!!form.formState.errors.alignment}
                        >
                          <SelectValue placeholder="Seleccione la alineación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={SPONSOR_ALIGNMENT.RIGHT}>
                              {getAlignment(SPONSOR_ALIGNMENT.RIGHT)}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {sponsor && (
              <div className="w-full lg:w-auto lg:mt-5">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="flex gap-3">
                      <FormLabel>Posición</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          value={field.value ?? '1'}
                          onChange={(e) => {
                            const clicks = parseInt(e.target.value);
                            field.onChange(clicks);
                          }}
                          className="w-16"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <div className="w-full inline-flex justify-end lg:w-auto lg:mt-5">
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
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => {
              route.replace(ROUTES.ADMIN_SPONSORS);
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
                <span className="text-sm italic">guardando</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              !sponsor ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
