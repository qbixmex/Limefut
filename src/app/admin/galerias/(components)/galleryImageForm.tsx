'use client';

import { useState, type FC } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useForm } from "react-hook-form";
import type z from "zod";
import type { GalleryImage } from "~/src/shared/interfaces";
import { createGalleryImageSchema, editGalleryImageSchema } from "~/src/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createGalleryImageAction } from "../(actions)";
import { toast } from "sonner";

type Props = Readonly<{
  session: Session;
  galleryId: string;
  galleryImage?: GalleryImage;
}>;

export const GalleryImageForm: FC<Props> = ({ session, galleryId, galleryImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const formSchema = !galleryImage
    ? createGalleryImageSchema
    : editGalleryImageSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: galleryImage?.title ?? '',
      permalink: galleryImage?.permalink ?? '',
      active: galleryImage?.active ?? false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();
    formData.append('title', data.title as string);
    formData.append('permalink', data.permalink as string);
    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
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
      return;
    }

    // Update Gallery Image
    // if (galleryImage) {
    //   const response = await updateGalleryImageAction({
    //     formData,
    //     teamId: galleryImage.id,
    //     userRoles: session.user.roles,
    //     authenticatedUserId: session?.user.id,
    //   });

    //   if (!response.ok) {
    //     toast.error(response.message);
    //     return;
    //   }

    //   if (response.ok) {
    //     toast.success(response.message);
    //     route.replace("/admin/galerias/>>permalink<<");
    //     return;
    //   }
    // }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <SheetTrigger asChild>
            <Button variant="outline-primary" size="icon">
              <Plus strokeWidth={3} />
            </Button>
          </SheetTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">Subir Imagen</TooltipContent>
      </Tooltip>
      <SheetContent side="right">
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
                        <Input {...field} value={field.value ?? ''} />
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
              </div>

              <Button
                type="submit"
                variant="outline-primary"
                size="lg"
                disabled={form.formState.isSubmitting}
                className="w-full"
                onClick={() => {
                  console.log("Errores del formulario:", form.formState.errors);
                  console.log("Valores del formulario:", form.getValues());
                }}
              >
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                    <span className="text-sm italic">Espere</span>
                    <LoaderCircle className="size-4 animate-spin" />
                  </span>
                ) : (
                  !galleryImage ? 'subir' : 'actualizar'
                )}
              </Button>
            </form>
          </Form>
        </section>
      </SheetContent>
    </Sheet>
  );
};
