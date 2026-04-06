'use client';

import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
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
import { createVideoSchema, editVideoSchema } from '@/shared/schemas';
import { createVideoAction, updateVideoAction } from '../(actions)';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Session } from '@/lib/auth-client';
import { toast } from 'sonner';
import type { Video } from '@/shared/interfaces';
import { ChevronDownIcon, LoaderCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ROUTES } from '@/shared/constants/routes';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { cn, slugify } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PLATFORM } from '@/shared/constants/platforms';

type Props = Readonly<{
  session: Session;
  video?: Video;
}>;

export const VideoForm: FC<Props> = ({ session, video }) => {
  const route = useRouter();
  const formSchema = !video ? createVideoSchema : editVideoSchema;
  const [openPublishedDateCalendar, setOpenPublishedDateCalendar] = useState(false);
  const isPermalinkEdited = useRef(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: video?.title ?? '',
      permalink: video?.permalink ?? '',
      url: video?.url ?? '',
      platform: video?.platform ?? undefined,
      publishedDate: video?.publishedDate ?? undefined,
      description: video?.description ?? '',
      active: video?.active ?? false,
    },
  });

  const [selectedPublishedDate, setSelectedPublishedDate] = useState<Date | undefined>(
    form.getValues('publishedDate'),
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('publishedDate', (data.publishedDate as Date).toString());
    formData.append('description', data.description as string ?? '');
    formData.append('url', data.url ?? '');
    formData.append('platform', data.platform ?? '');
    formData.append('active', String(data.active ?? false));

    // Create video
    if (!video) {
      const response = await createVideoAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace(ROUTES.ADMIN_VIDEOS);
      }

      return;
    }

    // Update video
    if (video) {
      const response = await updateVideoAction({
        formData,
        videoId: video?.id as string,
        userRoles: session.user.roles!,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      route.replace(ROUTES.ADMIN_VIDEOS);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Title and Permalink */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
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
          <div className="flex-1">
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
        </section>

        <section className="flex gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    URL <span className="text-amber-500">*</span>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Descripción <span className="text-amber-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      cols={2}
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
        </section>

        <section className="flex flex-col gap-5 lg:flex-row mb-10">
          <div className="w-full flex gap-5">
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Plataforma <span className="text-amber-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className="w-full"
                          aria-invalid={!!form.formState.errors.platform}
                        >
                          <SelectValue placeholder="Seleccione plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={PLATFORM.YOUTUBE}>Youtube</SelectItem>
                            <SelectItem value={PLATFORM.FACEBOOK}>Facebook</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/2">
              <FormField
                control={form.control}
                name="publishedDate"
                render={() => (
                  <FormItem>
                    <FormLabel htmlFor="date-picker" className="px-1">
                      Fecha de publicación <span className="text-amber-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Popover open={openPublishedDateCalendar} onOpenChange={setOpenPublishedDateCalendar}>
                        <PopoverTrigger asChild>
                          <Button
                            id="date-picker"
                            variant="secondary"
                            className={cn('justify-between font-normal border border-input bg-input/30 text-muted-foreground', {
                              'border-destructive border': form.formState.errors.publishedDate,
                            })}
                            aria-invalid={form.formState.errors.publishedDate ? 'true' : 'false'}
                          >
                            {selectedPublishedDate
                              ? format(selectedPublishedDate, "d 'de' MMMM 'del' yyyy", { locale: es })
                              : 'Seleccione la fecha de publicación'
                            }
                            <ChevronDownIcon />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedPublishedDate}
                            defaultMonth={selectedPublishedDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setSelectedPublishedDate(date);
                              form.setValue('publishedDate', date as Date);
                              setOpenPublishedDateCalendar(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="w-full flex items-end lg:justify-end gap-5">
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
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => {
              route.replace(ROUTES.ADMIN_VIDEOS);
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
              !video ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form >
  );
};
