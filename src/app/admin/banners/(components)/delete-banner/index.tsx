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
import { deleteHeroBannerAction } from '../../(actions)';
import './styles.css';

type Props = Readonly<{
  bannerId: string;
  roles: string[];
}>;

export const DeleteBanner: FC<Props> = ({ bannerId, roles }) => {
  const onDeleteBanner = async (id: string) => {
    if (!roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar banners !');
      return;
    }

    const { ok, message } = await deleteHeroBannerAction(id);

    if (!ok) {
      toast.error('Error', {
        description: <p className="text-pretty">{message}</p>,
        duration: 6000,
      });
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
              aria-label="Eliminar banner"
            >
              <Trash2 role="img" aria-label="Icono de basurero" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>eliminar</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar este banner ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y el banner será eliminado de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={() => onDeleteBanner(bannerId)}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
