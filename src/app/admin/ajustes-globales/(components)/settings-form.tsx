'use client';

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { GlobalSettingsSchema } from '@/shared/schemas';
import type z from 'zod';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { Session } from '@/lib/auth-client';
import { getSiteLanguage } from '@/lib/utils';
import { LANGUAGE } from '@/shared/enums';
import type { GlobalSettings } from '@/shared/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { upsertGlobalSettingsAction } from '../(actions)/upsertGlobalSettingsAction';
import { FormImage } from './form-image';

type Props = Readonly<{
  session: Session;
  globalSettings: GlobalSettings | null;
}>;

export const SettingsForm: FC<Props> = ({ session, globalSettings }) => {
  const form = useForm<z.infer<typeof GlobalSettingsSchema>>({
    resolver: zodResolver(GlobalSettingsSchema),
    defaultValues: {
      siteName: globalSettings?.siteName ?? undefined,
      organizationName: globalSettings?.organizationName ?? undefined,
      phone: globalSettings?.phone ?? undefined,
      address: globalSettings?.address ?? undefined,
      mapsUrl: globalSettings?.mapsUrl ?? undefined,
      country: globalSettings?.country ?? undefined,
      facebookUrl: globalSettings?.facebookUrl ?? undefined,
      twitterXUrl: globalSettings?.twitterXUrl ?? undefined,
      instagramUrl: globalSettings?.instagramUrl ?? undefined,
      youtubeUrl: globalSettings?.youtubeUrl ?? undefined,
      tiktokUrl: globalSettings?.tiktokUrl ?? undefined,
      whatsApp: globalSettings?.whatsApp ?? undefined,
      maintenanceMode: globalSettings?.maintenanceMode ?? false,
      maintenanceMessage: globalSettings?.maintenanceMessage ?? undefined,
      primaryColor: globalSettings?.primaryColor ?? undefined,
      secondaryColor: globalSettings?.secondaryColor ?? undefined,
      accentColor: globalSettings?.accentColor ?? undefined,
      googleAnalyticsId: globalSettings?.googleAnalyticsId ?? undefined,
      googleTagManager: globalSettings?.googleTagManager ?? undefined,
      metaPixelId: globalSettings?.metaPixelId ?? undefined,
      defaultLanguage: globalSettings?.defaultLanguage ?? undefined,
      timeZone: globalSettings?.timeZone ?? undefined,
      contactEmail: globalSettings?.contactEmail ?? undefined,
      fromEmail: globalSettings?.fromEmail ?? undefined,
      replyToEmail: globalSettings?.replyToEmail ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof GlobalSettingsSchema>) => {
    const formData = new FormData();
    formData.append('siteName', data.siteName as string);
    formData.append('organizationName', data.organizationName as string);
    formData.append('phone', data.phone as string);
    formData.append('address', data.address as string);
    formData.append('mapsUrl', data.mapsUrl as string);
    formData.append('country', data.country as string);
    if (data.logoImage && data.logoImage instanceof File) {
      formData.append('logoImage', data.logoImage);
    }
    if (data.faviconImage && data.faviconImage instanceof File) {
      formData.append('faviconImage', data.faviconImage);
    }
    formData.append('facebookUrl', data.facebookUrl as string);
    formData.append('twitterXUrl', data.twitterXUrl as string);
    formData.append('instagramUrl', data.instagramUrl as string);
    formData.append('tiktokUrl', data.tiktokUrl as string);
    formData.append('youtubeUrl', data.youtubeUrl as string);
    formData.append('whatsAppUrl', data.whatsApp as string);
    formData.append('maintenanceMode', String(data.maintenanceMode));
    formData.append('maintenanceMessage', data.maintenanceMessage as string);
    formData.append('primaryColor', data.primaryColor as string);
    formData.append('secondaryColor', data.secondaryColor as string);
    formData.append('accentColor', data.accentColor as string);
    formData.append('googleAnalyticsId', data.googleAnalyticsId as string);
    formData.append('googleTagManager', data.googleTagManager as string);
    formData.append('metaPixelId', data.metaPixelId as string);
    formData.append('defaultLanguage', data.defaultLanguage as string);
    formData.append('timeZone', data.timeZone as string);
    formData.append('contactEmail', data.contactEmail as string);
    formData.append('fromEmail', data.fromEmail as string);
    formData.append('replyToEmail', data.replyToEmail as string);

    // Upsert video
    const response = await upsertGlobalSettingsAction(
      formData,
      session?.user.roles ?? null,
    );

    if (!response.ok) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <h2 className="text-2xl font-semibold text-sky-500">Ajustes Generales</h2>

        {/* Site Name and Organization Name */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="siteName"
              shouldUnregister={true}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre del sitio
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de la organización
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Phone and Address */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Teléfono
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="333-555-2222" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Dirección <span className="text-gray-600">(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
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

        {/* MapsUrl and X */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="mapsUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Url del mapa
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://maps.app.goo.gl/2wpMPfH9atK5idKn8" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    País
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Default Language and TimeZone */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="defaultLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Lenguaje por defecto
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? ''}
                      onValueChange={(value) => {
                        field.onChange(value === 'none' ? '' : value);
                      }}
                    >
                      <SelectTrigger
                        className="w-full lg:w-auto"
                        aria-invalid={!!form.formState.errors.defaultLanguage}
                      >
                        <SelectValue placeholder="Seleccione idioma por defecto" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          field.value && field.value.length > 0 && (
                            <SelectItem value={LANGUAGE.NONE}>
                              {getSiteLanguage(LANGUAGE.NONE)}
                            </SelectItem>
                          )
                        }
                        <SelectItem value={LANGUAGE.SPANISH}>
                          {getSiteLanguage(LANGUAGE.SPANISH)}
                        </SelectItem>
                        <SelectItem value={LANGUAGE.ENGLISH}>
                          {getSiteLanguage(LANGUAGE.ENGLISH)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="timeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Zona Horaria
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? undefined}
                      onValueChange={(value) => {
                        field.onChange(value === 'none' ? '' : value);
                      }}
                    >
                      <SelectTrigger
                        className="w-full lg:w-auto"
                        aria-invalid={!!form.formState.errors.timeZone}
                      >
                        <SelectValue placeholder="Seleccione zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          field.value && field.value.length > 0 && (
                            <SelectItem value="none">Ninguna</SelectItem>
                          )
                        }
                        <SelectItem value="Americas/Cancun">
                          Cancun UTC-5
                        </SelectItem>
                        <SelectItem value="Americas/Mexico_City">
                          Guadalajara, Ciudad de México, Monterrey, UTC-6
                        </SelectItem>
                        <SelectItem value="America/Mazatlan">
                          Tijuana, Los Cabos, Hermosillo, Mazatlan UTC-7
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <h2 className="text-2xl font-semibold text-sky-500">Imágenes</h2>

        {/* Logo and Favicon images */}
        <section className="flex flex-col gap-5 lg:flex-row">
          <div className="flex-1 flex items-center gap-5">
            <FormImage
              imageUrl={globalSettings?.logoUrl as string}
              logoType="logo"
            />
            <FormField
              control={form.control}
              name="logoImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Logo principal
                    <span className='text-sm text-gray-600'>(opcional)</span>
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
          <div className="flex-1 flex items-center gap-5">
            <FormImage
              imageUrl={globalSettings?.faviconUrl as string}
              logoType="favicon"
            />
            <FormField
              control={form.control}
              name="faviconImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Favicon
                    <span className='text-sm text-gray-600'>(opcional)</span>
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

        <h2 className="text-2xl font-semibold text-sky-500">Redes Sociales</h2>

        {/* Facebook and Twitter X  */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Facebook url
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://facebook.com/nombre_perfil" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="twitterXUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Twitter X url
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://x.com/nombre_de_perfil" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Instagram and Youtube  */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Instagram url
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://instagram.com/nombre_de_perfil" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Youtube url
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://youtube.com/nombre_del_canal" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* TikTok and WhatsApp  */}
        <section className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="whatsApp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    TikTok url
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://tiktok.com/nombre_de_perfil" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="whatsApp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    WhatsApp
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="333-555-4444" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <h2 className="text-2xl font-semibold text-sky-500">Mantenimiento</h2>

        {/* Maintenance  */}
        <section className="w-full lg:w-1/2 flex flex-col gap-5">
          <FormField
            control={form.control}
            name="maintenanceMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Texto modo mantenimiento
                  <span className='text-sm text-gray-600'>(opcional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <Label htmlFor="active">Sitio en mantenimiento</Label>
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
        </section>

        <h2 className="text-2xl font-semibold text-sky-500">Colores del sitio</h2>

        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Color Primario
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="#FF0000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Color Secundario
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="#00FF00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Color de Acento
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="#0000FF" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <h2 className="text-2xl font-semibold text-sky-500">Analíticas</h2>

        <section className="flex flex-col lg:flex-row gap-5">
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ID de Google Analytics
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="googleTagManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tag de Google Manager
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full md:w-1/3">
            <FormField
              control={form.control}
              name="metaPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ID de Meta Pixel
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <h2 className="text-2xl font-semibold text-sky-500">Correos Electrónicos</h2>

        <section className="flex flex-col lg:flex-row gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo principal
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="fromEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo del remitente
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="replyToEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo del destinatario
                    <span className='text-sm text-gray-600'>(opcional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
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
              <span>guardar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
