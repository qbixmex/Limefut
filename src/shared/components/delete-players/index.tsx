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
import { toast } from 'sonner';
import { deletePlayersAction } from '@/shared/actions/deletePlayersAction';

type Props = Readonly<{
  teamId: string;
  roles: string[];
  className?: string;
}>;

export const DeletePlayers: FC<Props> = ({ teamId, roles, className = '' }) => {
  const onDeletePlayers = async () => {
    if (!roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar jugadores !');
      return;
    }

    const response = await deletePlayersAction(teamId);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    toast.success(response.message);
  };

  return (
    <div className={className}>
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="outline-danger" size="icon">
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left">
            <span>eliminar todos</span>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿ Estas seguro de eliminar los jugadores ?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer y los jugadores serán eliminados de la base de datos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="delete-btn"
              onClick={onDeletePlayers}
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
