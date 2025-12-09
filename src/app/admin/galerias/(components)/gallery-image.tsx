'use client';

import { useState, type FC } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useImageGallery } from "~/src/store";
import { deleteGalleryImageAction } from "../(actions)/deleteGalleryImageAction";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import "./styles.css";
import { cn } from "~/src/lib/utils";

type GalleryImageProps = Readonly<{
  images: {
    id: string;
    title: string;
    permalink: string;
    imageUrl: string;
    active: boolean;
  }[];
}>;

export const GalleryImage: FC<GalleryImageProps> = ({ images }) => {
  const { setGalleryImage } = useImageGallery();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteImage = async (id: string) => {
    setIsDeleting(true);
    const response = await deleteGalleryImageAction(id);
    if (response.ok) toast.success(response.message);
    setIsDeleting(false);
  };

  return (
    <>
      {
        images.map(({ id, title, permalink, imageUrl, active }) => (
          <figure key={id} className="space-y-2 relative">
            {<Image
              src={imageUrl}
              width={250}
              height={250}
              alt={title}
              className="size-[250px] rounded object-cover"
            />}
            <figcaption className="text-sm italic text-center text-gray-500">
              {title}
            </figcaption>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="warning"
                  className="absolute top-1 left-2"
                  size="icon"
                  onClick={() => setGalleryImage({ id, title, permalink, active })}
                >
                  <Pencil />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">editar</TooltipContent>
            </Tooltip>

            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" className="absolute top-2 right-3">
                      <Trash2 />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>eliminar</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿ Estas seguro de eliminar la imagen ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer y la imagen de la galería será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className={cn("delete-btn", { 'animate-pulse': isDeleting })}
                    onClick={() => onDeleteImage(id)}
                  >
                    {isDeleting ? (
                      <>
                        <span>espere</span>
                        <Loader2 className="animate-spin" />
                      </>
                    ) : <span>eliminar</span>
                    }
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </figure>
        ))
      }
    </>
  );
};