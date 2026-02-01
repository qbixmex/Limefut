'use client';

import type { ChangeEvent, FC } from 'react';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, LoaderCircle, X } from 'lucide-react';
import { cn, slugify } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import type z from 'zod';
import { createPageSchema, editPageSchema } from '@/shared/schemas';
import { updatePageAction } from '../(actions)/updatePageAction';
import { MdEditorField } from "./md-editor-field";
import type { CustomPageImage, Page } from '@/shared/interfaces/Page';
import { deleteContentImageAction } from '../(actions)/deleteContentImageAction';
import "./styles.css";
import { CharactersCounter } from '@/shared/components/characters-counter';

type Props = Readonly<{
  page: Page & { images: CustomPageImage[] };
}>;

type CountCharacters = {
  count: number;
  focused: boolean;
};

export const PageForm: FC<Props> = ({ page }) => {
  const route = useRouter();
  const formSchema = !page ? createPageSchema : editPageSchema;
  const isPermalinkEdited = useRef(false);
  const [contentImages, setContentImages] = useState<CustomPageImage[]>(page.images);
  const [isDeletingImage, setIsDeletingImage] = useState<string | null>(null);
  const [isDraft, setIsDraft] = useState(false);
  const onSaveDraft = () => setIsDraft(true);

  const [seoTitleChars, setSeoTitleChars] = useState<CountCharacters>({
    count: page.seoTitle ? page.seoTitle?.length : 0,
    focused: false,
  });

  const [seoDescriptionChars, setSeoDescriptionChars] = useState<CountCharacters>({
    count: page.seoDescription ? page.seoDescription?.length : 0,
    focused: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: page.title ?? '',
      permalink: page.permalink ?? '',
      content: page.content ?? '',
      seoTitle: page.seoTitle ?? undefined,
      seoDescription: page.seoDescription ?? undefined,
      seoRobots: page.seoRobots ?? 'noindex, nofollow',
      position: page.position ?? 0,
      status: page.status ?? 'draft',
    },
  });

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    form.setValue('permalink', event.target.value, { shouldValidate: true });
  };

  const handleNameTitle = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      form.setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  const updateContentImage = useCallback((customPageImage: CustomPageImage) => {
    setContentImages((prev) => [...prev, customPageImage]);
  }, []);

  const handleDeleteImage = async (customPageImage: CustomPageImage) => {
    setIsDeletingImage(customPageImage.imageUrl);

    const response = await deleteContentImageAction(
      page.id as string,
      customPageImage.publicId,
    );

    if (response.ok) {
      setContentImages(prevImages => prevImages.filter(({ imageUrl }) => {
        return imageUrl !== customPageImage.imageUrl;
      }));
      setIsDeletingImage(null);
      toast.success("Imagen eliminada correctamente 👍");
    }

    if (!response.ok) {
      setIsDeletingImage(null);
      toast.error("¡ No se pudo eliminar la imagen !");
    }
  };

  const copyToClipboard = async (text: string) => {
    if (typeof window === 'undefined') return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // fallback: prompt sin manipular el DOM
      window.prompt('Copia la URL (Cmd/Ctrl+C):', text);
      return false;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    formData.append('content', data.content as string);
    formData.append('seoTitle', data.seoTitle as string);
    formData.append('seoDescription', data.seoDescription as string);
    formData.append('seoRobots', data.seoRobots as string);
    formData.append('position', String(data.position ?? 0));
    formData.append('status', data.status as string);

    if (page) {
      const response = await updatePageAction({
        formData,
        pageId: page.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);

      if (!isDraft) {
        route.replace("/admin/paginas");
      }

      setIsDraft(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* Title and Permalink */}
          <section className="flex flex-col gap-5 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Página</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        onChange={handleNameTitle}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <FormField
                control={form.control}
                name="permalink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enlace Permanente</FormLabel>
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

          <h2 className="text-xl font-semibold text-sky-500">Contenido</h2>

          <section>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MdEditorField
                      markdownString={field.value}
                      setContent={value => field.onChange(value)}
                      pageId={page?.id}
                      updateContentImage={updateContentImage}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <h2 className="text-xl font-semibold text-sky-500">SEO</h2>

          <section className="flex flex-col gap-5 lg:flex-row">
            <div className="w-full lg:w-1/2 flex flex-col gap-5">
              <div>
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título SEO</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          onFocus={() => setSeoTitleChars((prev) => ({
                            ...prev,
                            focused: true,
                          }))}
                          onBlur={() => setSeoTitleChars((prev) => ({
                            ...prev,
                            focused: false,
                          }))}
                          onChange={(event) => {
                            field.onChange(event);
                            setSeoTitleChars((prev => ({
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
                {seoTitleChars.focused && (
                  <div className="mt-3 ml-2">
                    <CharactersCounter
                      charactersCount={seoTitleChars.count}
                      limit={70}
                    />
                  </div>
                )}
              </div>
              <FormField
                control={form.control}
                name="seoRobots"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Robots SEO</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger
                          className={cn('w-full', {
                            'border-destructive ring-0.5 ring-destructive': form.formState.errors.seoRobots,
                          })}
                        >
                          <SelectValue placeholder="Seleccione una Opción" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="index, follow">Indexar y Seguir</SelectItem>
                          <SelectItem value="index, nofollow">Indexar y No Seguir</SelectItem>
                          <SelectItem value="noindex, follow">No Indexar y Seguir</SelectItem>
                          <SelectItem value="noindex, nofollow">No Indexar y No Seguir</SelectItem>
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
                name="seoDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción SEO</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        className="h-[115px] resize-none"
                        onFocus={() => setSeoDescriptionChars((prev) => ({
                          ...prev,
                          focused: true,
                        }))}
                        onBlur={() => setSeoDescriptionChars((prev) => ({
                          ...prev,
                          focused: false,
                        }))}
                        onChange={(event) => {
                          field.onChange(event);
                          setSeoDescriptionChars((prev => ({
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
              {seoDescriptionChars.focused && (
                <div className="mt-3 ml-2">
                  <CharactersCounter
                    charactersCount={seoDescriptionChars.count}
                    limit={160}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Position and Status */}
          <div className="flex flex-col gap-5 lg:flex-row">
            <div className="w-full lg:w-1/2">
              {/* EMPTY FOR UI */}
            </div>
            <div className="w-full lg:w-1/2 flex justify-end gap-5">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ?? undefined}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger
                            className={cn('w-full', {
                              'border-destructive ring-0.5 ring-destructive': form.formState.errors.seoRobots,
                            })}
                          >
                            <SelectValue placeholder="Seleccione una Opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="hold">Retenido</SelectItem>
                            <SelectItem value="unpublished">No Publicado</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            </div>
          </div>

          {/* CONTENT IMAGES */}
          <section>
            {(contentImages.length > 0) && (
              <>
                <h2 className="text-3xl mt-8 font-semibold mb-5">
                  Imágenes del contenido
                </h2>

                <div className="flex flex-wrap gap-5">
                  {contentImages.map((customPageImage) => (
                    <figure key={customPageImage.publicId} className="relative w-fit">
                      <Image
                        src={customPageImage.imageUrl}
                        alt="Imagen del contenido"
                        width={200}
                        height={200}
                        className="w-[150px] h-[150px] object-cover rounded-lg"
                      />
                      <div className="absolute top-0 right-0 w-full flex justify-between gap-2">
                        <Button
                          type="button"
                          size="icon"
                          // disabled={isDeletingImage === articleImage.imageUrl}
                          className={cn("bg-cyan-600/70! hover:bg-cyan-600! cursor-pointer", {
                            // "cursor-not-allowed bg-gray-500!": isDeletingImage === articleImage.imageUrl,
                          })}
                          onClick={async () => {
                            const url = customPageImage.imageUrl;
                            const ok = await copyToClipboard(url);
                            if (ok) toast.success('URL copiada al portapapeles 👍');
                            else toast('URL mostrada para copia manual');
                          }}
                        >
                          <Copy className="size-[25px]" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          disabled={isDeletingImage === customPageImage.imageUrl}
                          className={cn("bg-pink-600/70! hover:bg-pink-600! cursor-pointer", {
                            "cursor-not-allowed bg-gray-500!": isDeletingImage === customPageImage.imageUrl,
                          })}
                          onClick={() => handleDeleteImage(customPageImage)}
                        >
                          {isDeletingImage === customPageImage.imageUrl
                            ? <LoaderCircle className="animate-spin" />
                            : <X className="size-[25px]" />
                          }
                        </Button>
                      </div>
                    </figure>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline-secondary"
              size="lg"
              onClick={() => route.replace('/admin/paginas')}
            >
              cancelar
            </Button>

            <Button
              type="submit"
              variant="outline-primary"
              size="lg"
              disabled={form.formState.isSubmitting}
              onClick={onSaveDraft}
            >
              {form.formState.isSubmitting && isDraft ? (
                <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                  <span className="text-sm italic">guardando</span>
                  <LoaderCircle className="size-4 animate-spin" />
                </span>
              ) : (
                <span>guardar</span>
              )}
            </Button>

            <Button
              type="submit"
              variant="outline-success"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && !isDraft ? (
                <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                  <span className="text-sm italic">publicando</span>
                  <LoaderCircle className="size-4 animate-spin" />
                </span>
              ) : (
                <span>guardar y cerrar</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PageForm;
