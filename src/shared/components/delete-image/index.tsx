'use client';

import type { FC } from 'react';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

type Props = Readonly<{
  onDeleteImage: () => void;
  className?: string;
}>;

export const DeleteImage: FC<Props> = ({ onDeleteImage, className = '' }) => {
  return (
    <div className={className}>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline-danger"
                size="icon"
                className="opacity-50 hover:opacity-100"
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>eliminar</span>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿ Estas seguro de eliminar la imagen ?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer y la imagen será eliminada de la base de datos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="delete-btn"
              onClick={onDeleteImage}
              autoFocus
            >
              eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
