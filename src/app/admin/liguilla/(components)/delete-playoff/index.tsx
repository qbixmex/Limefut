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
import { deletePlayoffAction } from '@/app/admin/liguilla/(actions)/delete-playoff.action';
import './styles.css';

type Props = Readonly<{
  id: string;
  authenticatedUserId: string | undefined;
  authenticatedUserRoles: string[] | null | undefined;
}>;

export const DeletePlayoff: FC<Props> = ({
  id,
  authenticatedUserId,
  authenticatedUserRoles,
}) => {
  const onDeleteMatch = async (id: string) => {
    if (!authenticatedUserId) {
      toast.error('¡ Tienes que estar autentificado para eliminar liguillas !');
      return;
    }
    if (!authenticatedUserRoles?.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar liguillas !');
      return;
    }
    const response = await deletePlayoffAction(id);
    if (!response.ok) {
      toast.error(response.message);
      return;
    }
    toast.success(response.message);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="outline-danger" size="icon">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>eliminar</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar la liguilla ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y la liguilla será eliminada de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={() => onDeleteMatch(id)}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
