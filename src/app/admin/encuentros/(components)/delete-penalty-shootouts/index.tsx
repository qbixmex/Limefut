'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import './styles.css';
import { toast } from 'sonner';
import { deletePenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/delete-penalty-shootout.action';

type Props = Readonly<{
  penaltyShootoutsId: string;
  winnerTeamId: string | null;
}>;

export const DeletePenaltyShootouts: FC<Props> = ({ penaltyShootoutsId, winnerTeamId }) => {
  const handleDeletePenaltyShootouts = async () => {
    const response = await deletePenaltyShootoutAction(penaltyShootoutsId, winnerTeamId);
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
            <Button variant="outline-danger" size="icon-sm">
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="left">
          <span>eliminar tanda</span>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿ Estas seguro de eliminar la tanda de penales ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y la tanda de penales será eliminada de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={handleDeletePenaltyShootouts}
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
