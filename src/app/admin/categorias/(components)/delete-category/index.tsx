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
import { deleteCategoryAction } from '../../(actions)/delete-category.action';
import styles from './styles.module.css';

type Props = Readonly<{
  categoryId: string;
  roles: string[];
}>;

export const DeleteCategory: FC<Props> = ({ categoryId, roles }) => {
  const onDeleteCategory = async () => {
    if (roles && !roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar categorías !');
      return;
    }
    const { ok, message } = await deleteCategoryAction(categoryId);

    if (ok) toast.success(message);
    else toast.error(message);
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
          <AlertDialogTitle>¿ Estas seguro de eliminar la categoría ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y la categoría será eliminada de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={styles.cancelBtn}>
            cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={styles.deleteBtn}
            onClick={onDeleteCategory}
            autoFocus
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
