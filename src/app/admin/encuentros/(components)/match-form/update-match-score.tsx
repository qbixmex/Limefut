'use client';

import { useRouter } from 'next/navigation';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { updateMatchScoreAction } from '@/app/admin/encuentros/(actions)/update-match-score.action';
import type { MatchType } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { ROUTES } from '@/shared/constants/routes';

type Props = {
  match: MatchType;
};

export const UpdateMatchScore = ({ match }: Props) => {
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

    const { ok, message, currentMatch } = await updateMatchScoreAction(data);

    if (!ok) {
      toast.error(message);
      return;
    }

    toast.success(message);
    router.replace(
      ROUTES.ADMIN_MATCHES +
      `?tournament=${currentMatch?.tournament.permalink}` +
      `&category=${currentMatch?.tournament.category}` +
      `&sort-week=${match.week}`,
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="outline-success"
          onClick={() => {}}
        >
          Actualizar Marcador
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">¿ Confirmas que quieres actualizar el marcador ?</AlertDialogTitle>
          <AlertDialogDescription className="text-center text-emerald-500 font-bold">
            ¡ La Tabla de Posiciones y Estadísticas serán afectadas !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cancel-btn">cancelar</AlertDialogCancel>
          <AlertDialogAction
            className="finish-btn"
            onClick={handleUpdateScore}
          >
            Proceder
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
