import { useState, type FC } from 'react';
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
import {  } from "react";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { EyeOff, Loader2, Pencil, Trash2 } from "lucide-react";
import { useImageGallery } from '~/src/store';
import { deleteGalleryImageAction } from '../(actions)/deleteGalleryImageAction';
import { toast } from 'sonner';
import { cn } from '~/src/lib/utils';

type Props = Readonly<{
  galleyImage: {
    id: string;
    title: string;
    permalink: string | null;
    imageUrl: string;
    active: boolean;
  };
}>;

export const GalleryImage: FC<Props> = ({ galleyImage }) => {
  const { id, title, permalink = '', imageUrl, active } = galleyImage;
  const { setGalleryImage } = useImageGallery();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteImage = async (id: string) => {
    setIsDeleting(true);
    const response = await deleteGalleryImageAction(id);
    if (response.ok) toast.success(response.message);
    setIsDeleting(false);
  };

  return (
    <figure className="space-y-2 relative">
      {<Image
        src={imageUrl}
        width={250}
        height={250}
        alt={title}
        className="size-[250px] rounded object-cover"
      />}

      {!active && (
        <>
          <div className="bg-black/50 size-[250px] absolute top-0 left-0 rounded z-10" />
          <Tooltip>
            <TooltipTrigger asChild>
              <EyeOff
                size={40}
                className="absolute left-[50%] top-[50%] -translate-[50%] text-gray-400 z-20"
              />
            </TooltipTrigger>
            <TooltipContent side="left">Oculta</TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="warning"
            className="absolute top-1 left-2 z-20"
            size="icon"
            onClick={() => setGalleryImage({
              id,
              title,
              permalink: permalink as string,
              active,
            })}
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
              <Button variant="destructive" size="icon" className="absolute top-2 right-3 z-20">
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
  );
};

export default GalleryImage;
