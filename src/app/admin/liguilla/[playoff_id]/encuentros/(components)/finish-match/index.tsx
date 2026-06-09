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
import { toast } from 'sonner';
import { finishPlayoffMatchAction } from '../../(actions)/finish-playoff-match.action';

type Props = Readonly<{
  matchId: string;
  localScore: number;
  visitorScore: number;
  localId: string;
  visitorId: string;
}>;

export const FinishMatch: FC<Props> = (props) => {
  const handleFinishMatch = async () => {
    const response = await finishPlayoffMatchAction(props);

    if (!response.ok) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline-primary" size="lg">
          Finalizar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Confirmas que quieres finalizar el encuentro ?</AlertDialogTitle>
          <AlertDialogDescription>
            Al finalizar el encuentro se establecerá el equipo ganador con el marcador actual
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={handleFinishMatch}
          >
            Proceder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
