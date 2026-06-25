'use client';

import { useState, type FC } from 'react';
import { deleteGalleryImageAction } from '../../(actions)/deleteGalleryImageAction';
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
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { cn } from '~/src/lib/utils';
import styles from './styles.module.css';

export const DeleteGalleryImage: FC<{ imageId: string }> = ({ imageId }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDeleteImage = async (id: string) => {
    setIsDeleting(true);
    const response = await deleteGalleryImageAction(id);
    if (response.ok) {
      toast.success(response.message);
    }
    setIsDeleting(false);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              className={styles.deleteButton}
            >
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
            Esta acción no se puede deshacer{' '}
            y la imagen de la galería será eliminada permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={styles.cancelBtn}>cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(styles.deleteBtn, { 'animate-pulse': isDeleting })}
            onClick={() => onDeleteImage(imageId)}
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
  );
};
