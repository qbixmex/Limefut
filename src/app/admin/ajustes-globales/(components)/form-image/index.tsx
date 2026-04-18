'use client';

import type { FC } from 'react';
import { useTransition } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import './form-image.css';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deleteLogoImageAction } from '../../(actions)/deleteLogoImageAction';
import { toast } from 'sonner';

type Props = Readonly<{
  imageUrl: string;
  logoType: 'logo' | 'logo-admin' | 'favicon';
  className?: string;
}>;

export const FormImage: FC<Props> = ({ imageUrl, logoType, className }) => {
  const [isPending, startTransition] = useTransition();
  const handleDeleteImage = async () => {
    startTransition(async () => {
      const { ok, message } = await deleteLogoImageAction({
        deleteLogoImage: logoType === 'logo',
        deleteLogoAdminImage: logoType === 'logo-admin',
        deleteFavIcon: logoType === 'favicon',
      });

      if (!ok) {
        toast.error(message);
        return;
      }

      toast.success(message);
    });
  };

  return (
    <figure className="relative">
      {!imageUrl || isPending ? (
        <ImageIcon
          strokeWidth={1}
          className={cn('image-placeholder', {
            'animate-pulse': isPending,
          })}
        />
      ) : (
        <div className="relative">
          <Image
            src={imageUrl}
            width={96}
            height={96}
            alt="Logotipo principal"
            className={cn('logotype-image', className)}
          />
          <div className="absolute -top-2 -right-2">
            <AlertDialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline-danger"
                      size="icon"
                      className="size-5 rounded-full opacity-75 hover:opacity-100"
                      disabled={isPending}
                    >
                      <X className="size-3" strokeWidth={3} />
                    </Button>
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>eliminar</p>
                </TooltipContent>
              </Tooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿ Estas seguro de eliminar la imagen ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer y la imagen será eliminada de la base de datos permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="group delete-btn"
                    onClick={handleDeleteImage}
                    autoFocus
                  >
                    eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </figure>
  );
};
