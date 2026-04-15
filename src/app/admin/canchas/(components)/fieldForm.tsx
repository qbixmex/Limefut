'use client';

import { useRef, useState, type FC, type ChangeEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { createFieldSchema, editFieldSchema } from '@/shared/schemas';
import type { Field } from '@/shared/interfaces';
import { createFieldAction } from '../(actions)';
import type { Session } from '@/lib/auth-client';
import { slugify } from '@/lib/utils';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  session: Session;
  field?: Field;
}>;

export const FieldForm: FC<Props> = ({ session, field }) => {
  const route = useRouter();
  const formSchema = !field ? createFieldSchema : editFieldSchema;
  const isPermalinkEdited = useRef(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: field?.name ?? 'Soccer Field',
      permalink: field?.permalink ?? 'soccer-field',
      city: field?.city ?? 'Zapopan', // undefined
      state: field?.state ?? 'Jalisco', // undefined
      country: field?.country ?? 'México', // undefined
      address: field?.address ?? 'Avenida Lopez de Legaspi #333', // undefined
      map: field?.map ?? 'https://maps.app.goo.gl/eYugNe5Cay9cFwex9', // undefined
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

    formData.append('name', data.name?.trim() as string);
    formData.append('permalink', data.permalink as string);
    if (data.city) formData.append('city', data.city.trim());
    if (data.state) formData.append('state', data.state.trim());
    if (data.country) formData.append('country', data.country.trim());
    if (data.address) formData.append('address', data.address.trim());
    if (data.map) formData.append('map', data.map.trim());

    // Create Field
    if (!field) {
      const response = await createFieldAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        form.reset();
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_FIELDS);
      }
      return;
    }

    // Update Field
    if (field) {
      // const response = await updateTeamAction({
      //   formData,
      //   teamId: field.id,
      //   userRoles: session.user.roles as string[],
      //   authenticatedUserId: session?.user.id,
      // });

      // if (!response.ok) {
      //   toast.error(response.message);
      //   return;
      // }

      // if (response.ok) {
      //   toast.success(response.message);
      //   route.replace(ROUTES.ADMIN_TEAM(response.team?.id as string));
      // }
    }
  };

  const handleNavigateBack = () => {
    route.replace(ROUTES.ADMIN_FIELDS);
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
                    Nombre <span className="text-orange-500">*</span>
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
                    Enlace Permanente <span className="text-orange-500">*</span>
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

        {/* City and State */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Ciudad <span className="text-sm text-gray-600">(opcional)</span>
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
                    Estado <span className="text-sm text-gray-600">(opcional)</span>
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

        {/* Country and Address */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    País <span className="text-sm text-gray-600">(opcional)</span>
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dirección <span className="text-sm text-gray-600">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
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

        {/* Map */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="map"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mapa <span className="text-sm text-gray-600">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Ejemplo: https://maps.app.goo.gl/eYugNe5Cay9cFwex9"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            {/* EMPTY FOR UI */}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
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
              !field ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
