'use client';

import { useEffect, useState, type FC } from "react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoaderCircle, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import type z from "zod";
import { createGalleryImageSchema, editGalleryImageSchema } from "~/src/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createGalleryImageAction, updateGalleryImageAction } from "../(actions)";
import { toast } from "sonner";
import { useImageGallery } from "~/src/store";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Props = Readonly<{
  session: Session;
  galleryId: string;
}>;

export const GalleryImageForm: FC<Props> = ({ session, galleryId }) => {
  const { galleryImage, clearGalleryImage } = useImageGallery();
  const [isOpen, setIsOpen] = useState(false);
  const formSchema = !galleryImage
    ? createGalleryImageSchema
    : editGalleryImageSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      permalink: '',
      active: false,
    },
  });

  useEffect(() => {
    if (galleryImage) {
      form.reset({
        title: galleryImage.title,
        permalink: galleryImage.permalink,
        active: galleryImage.active,
      });
    } else {
      form.reset({
        title: '',
        permalink: '',
        active: false,
      });
    }
  }, [galleryImage, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);

    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }

    if (data.active) {
      formData.append('active', String(data.active));
    }

    // Create Gallery Image
    if (!galleryImage) {
      const response = await createGalleryImageAction({
        userRoles: session?.user.roles ?? null,
        galleryId,
        formData,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        setIsOpen(false);
        return;
      }
    }

    // Update Gallery Image
    if (galleryImage) {
      const response = await updateGalleryImageAction({
        formData,
        authenticatedUserId: session?.user.id,
        userRoles: session.user.roles,
        galleryImageId: galleryImage.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        clearGalleryImage();
        setIsOpen(false);
        return;
      }
    }
  };

  return (
    <Sheet open={galleryImage !== null || isOpen} onOpenChange={(open) => {
      if (!open && galleryImage !== null) {
        clearGalleryImage();
      }
      setIsOpen(open);
    }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button
              variant="outline-primary"
              size="icon"
            >
              <Plus strokeWidth={3} />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          Subir Imagen
        </TooltipContent>
      </Tooltip>
      <SheetContent side="right" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader>
          <SheetTitle>Subir Imagen</SheetTitle>
        </SheetHeader>

        <section className="p-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-5 mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Título de la imagen
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value ?? ''}
                          autoFocus={false}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagen</FormLabel>
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

                <div className="inline-flex justify-end">
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

              <Button
                type="submit"
                variant="outline-primary"
                size="lg"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                    <span className="text-sm italic">Espere</span>
                    <LoaderCircle className="size-4 animate-spin" />
                  </span>
                ) : (
                  <span className="inline-flex gap-3">
                    <span className="text-sm italic">Guardar</span>
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </section>
      </SheetContent>
    </Sheet>
  );
};
