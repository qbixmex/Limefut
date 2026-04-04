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
import { deleteSponsorAction } from '../../(actions)';

type Props = Readonly<{
  sponsorId: string;
  roles: string[];
}>;

export const DeleteSponsor: FC<Props> = ({ sponsorId, roles }) => {
  const onDeleteSponsor = async () => {
    if (!roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar patrocinadores !');
      return;
    }
    const { ok, message } = await deleteSponsorAction(sponsorId);

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
          <AlertDialogTitle>¿ Estas seguro de eliminar este patrocinador ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y el patrocinador será eliminado de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={onDeleteSponsor}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
