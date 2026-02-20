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
import { GrUpdate as UpdateIcon } from "react-icons/gr";
import { toast } from 'sonner';
import { recalculateStandingsAction } from '../(actions)/recalculateStandingsAction';

type Props = Readonly<{
  tournamentId: string;
}>;

export const UpdateStandings: FC<Props> = ({ tournamentId }) => {
  const handleUpdateStandings = async () => {
    const response = await recalculateStandingsAction(tournamentId);

    try {
      if (!response.ok) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="outline-warning">
              <UpdateIcon />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <span>eliminar</span>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de actualizar la tabla ?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-5">
              <p className="text-pretty">Las estadísticas se van a volver a calcular de los encuentros disputados.</p>
              <p className="text-pretty">Este proceso puede demorar dependiendo de la cantidad de partidos completados.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={handleUpdateStandings}
          >
            actualizar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
