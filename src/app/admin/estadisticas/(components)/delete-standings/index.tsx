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
import { deleteStandingsAction } from '../../(actions)/delete-standings.action';
import styles from './styles.module.css';

type Props = Readonly<{
  tournamentId: string;
  categoryId: string;
}>;

export const DeleteStandings: FC<Props> = ({ tournamentId, categoryId }) => {
  const handleDeleteStandings = async () => {
    try {
      const response = await deleteStandingsAction({
        tournamentId,
        categoryId,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    } catch (error) {
      toast.error((error as Error).message);
    }
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
        <TooltipContent side="left">
          <span>eliminar</span>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar la tabla ?</AlertDialogTitle>
          <AlertDialogDescription>
            Si elimina la tabla, todas las estadísticas se perderán y no podrán ser recuperadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={styles.cancel}>
            cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={styles.delete}
            onClick={handleDeleteStandings}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
