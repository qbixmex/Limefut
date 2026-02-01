'use client';

import { type FC, useState } from 'react';
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
import { createHeroBannerSchema, editHeroBannerSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from 'next-auth';
import { toast } from 'sonner';
import type { HeroBanner } from '@/shared/interfaces';
import { createHeroBannerAction, updateHeroBannerAction } from '../(actions)';
import { LoaderCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { CharactersCounter } from '@/shared/components/characters-counter';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type Props = Readonly<{
  session: Session;
  heroBanner?: HeroBanner;
}>;

type CountCharacters = {
  count: number;
  focused: boolean;
};

export const BannerForm: FC<Props> = ({ session, heroBanner }) => {
  const route = useRouter();
  const formSchema = !heroBanner ? createHeroBannerSchema : editHeroBannerSchema;
  const [descriptionChars, setDescriptionChars] = useState<CountCharacters>({
    count: heroBanner?.description ? heroBanner?.description?.length : 0,
    focused: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: heroBanner?.title ?? '',
      description: heroBanner?.description ?? '',
      dataAlignment: heroBanner?.dataAlignment ?? undefined,
      position: heroBanner?.position ?? 0,
      showData: heroBanner?.showData ?? false,
      active: heroBanner?.active ?? false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('description', data.description as string);
    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }
    if (data.dataAlignment) formData.append('dataAlignment', data.dataAlignment as string);
    if (data.showData) formData.append('showData', String(data.showData ?? false));
    formData.append('position', String(data.position ?? 0));
    formData.append('active', String(data.active ?? false));

    // Create Hero Banner
    if (!heroBanner) {
      const response = await createHeroBannerAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(`/admin/banners/${response.heroBanner?.id}`);
      }
      return;
    }

    // Update Hero Banner
    if (heroBanner) {
      const response = await updateHeroBannerAction({
        formData,
        heroBannerId: heroBanner?.id as string,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      route.replace(`/admin/banners/${heroBanner.id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Title and Image */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <span className="text-amber-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ''}
                      className="h-[115px] resize-none"
                      onFocus={() => setDescriptionChars((prev) => ({
                        ...prev,
                        focused: true,
                      }))}
                      onBlur={() => setDescriptionChars((prev) => ({
                        ...prev,
                        focused: false,
                      }))}
                      onChange={(event) => {
                        field.onChange(event);
                        setDescriptionChars((prev => ({
                          ...prev,
                          count: event.target.value.length,
                        })));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {descriptionChars.focused && (
              <div className="mt-3 ml-2">
                <CharactersCounter
                  charactersCount={descriptionChars.count}
                  limit={300}
                />
              </div>
            )}
          </div>
        </div>

        <h2 className="font-semibold mb-2">Información:</h2>

        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col lg:flex-row items-center gap-5">
              <div className="w-full lg:w-1/2">
                <FormField
                  control={form.control}
                  name="dataAlignment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger
                            className={cn('w-full', {
                              'border-destructive ring-0.5 ring-destructive': form.formState.errors.dataAlignment,
                            })}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Alineada a la izquierda</SelectItem>
                            <SelectItem value="center">Alineada al centro</SelectItem>
                            <SelectItem value="right">Alineada a la derecha</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full lg:w-1/2">
                <FormField
                  control={form.control}
                  name="showData"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <Label htmlFor="showData">
                          {field.value ? 'Visible' : 'Oculta'}
                        </Label>
                        <FormControl>
                          <Switch
                            id="showData"
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
          </div>
          <div className="w-full lg:w-1/2">
            {/* Position & Active */}
            {heroBanner && (
              <div className="flex gap-5 justify-end">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3">
                        <Label htmlFor="position">Posición</Label>
                        <FormControl>
                          <Input
                            id="position"
                            type="number"
                            min={1}
                            {...field}
                            value={field.value ?? '0'}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="w-20"
                          />
                        </FormControl>
                      </div>
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
                        <Label htmlFor="active">
                          {field.value ? 'Activo' : 'Desactivado'}
                        </Label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.replace('/admin/banners')}
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
              !heroBanner ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BannerForm;
