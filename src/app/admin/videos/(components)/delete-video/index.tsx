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
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import './styles.css';
import { deleteVideoAction } from '../../(actions)';

type Props = Readonly<{
  videoId: string;
  roles: string[];
}>;

export const DeleteVideo: FC<Props> = ({ videoId, roles }) => {
  const onDeleteVideo = async () => {
    if (!roles.includes('admin')) {
      toast.error('No tienes permisos administrativos para eliminar videos');
      return;
    }
    const { ok, message } = await deleteVideoAction(videoId);

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline-danger"
              size="icon"
              aria-label="Eliminar video"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">eliminar</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar este video ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y el video será eliminado de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={onDeleteVideo}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
