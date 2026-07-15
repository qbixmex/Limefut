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

import styles from './styles.module.css';
import { useDeleteTournament } from './use-delete-tournament';

type Props = Readonly<{
  tournamentId: string;
  roles: string[];
}>;

export const DeleteTournament: FC<Props> = ({ tournamentId, roles }) => {
  const { onDeleteTournament } = useDeleteTournament(
    tournamentId,
    roles,
  );

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline-danger"
              size="icon"
              aria-label="Eliminar torneo"
            >
              <Trash2 role="img" aria-label="Icono de basurero" />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          eliminar
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar el torneo ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y el torneo será eliminado de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={styles.cancelBtn}
            aria-label="Cancelar eliminación"
          >
            cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={styles.deleteBtn}
            onClick={onDeleteTournament}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
