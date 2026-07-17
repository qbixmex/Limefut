'use client';

import type { FC } from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { updateMatchScoreAction } from '@/app/admin/encuentros/(actions)/update-match-score.action';
import { ROUTES } from '@/shared/constants/routes';
import type { MATCH_TYPE } from '../../(actions)/fetch-match.action';

type Props = {
  match: MATCH_TYPE;
  setHiddenScores: (value: boolean) => void;
};

export const UpdateMatchScore: FC<Props> = ({ match, setHiddenScores }) => {
  const router = useRouter();
  const { getValues } = useFormContext();

  const handleUpdateScore = async () => {
    const data = {
      matchId: match.id,
      localScore: getValues('localScore') as number,
      visitorScore: getValues('visitorScore') as number,
      localId: match.localTeam.id,
      visitorId: match.visitorTeam.id,
    };

    const response = await updateMatchScoreAction(data);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    const currentMatch = response.currentMatch as MATCH_TYPE;

    setHiddenScores(true);

    toast.success(response.message);

    router.replace(
      ROUTES.ADMIN_MATCHES +
      `?tournament=${currentMatch.tournament.permalink}` +
      `&category=${currentMatch.category?.permalink}` +
      `&sort-week=${match.week}`,
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={
        buttonVariants({ variant: 'outline-success' })
      }
      >
        actualizar marcador
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">¿ Esta seguro que quieres actualizar el marcador ?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-orange-500 font-medium">
            La tabla de posiciones y estadísticas serán actualizadas
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: 'outline-secondary' })}
          >cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpdateScore}
            className={buttonVariants({ variant: 'outline-warning' })}
          >
            Proceder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
