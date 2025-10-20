'use client';

import { FC } from "react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { deleteCredentialAction } from "../../(actions)";
import "./styles.css";

type Props = Readonly<{
  id: string;
  roles: string[];
}>;

export const DeleteCredential: FC<Props> = ({ id, roles }) => {
  const onDeleteCredential = async (id: string) => {
    if (!roles.includes('admin')) {
      toast.error('¡ No tienes permisos administrativos para eliminar credenciales !');
      return;
    }
    const response = await deleteCredentialAction(id);
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
          <AlertDialogTitle>¿ Estas seguro de eliminar la credencial ?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer y la credencial será eliminado de la base de datos permanentemente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="delete-btn"
            onClick={() => onDeleteCredential(id)}
          >
            eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCredential;
