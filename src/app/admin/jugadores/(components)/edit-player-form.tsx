'use client';

import type { FC } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import type { Session } from '@/lib/auth-client';
import { useEditPlayer } from './use-edit-player';
import { FormFields } from './form-fields';

type TeamType = {
  id: string;
  name: string;
};

type PlayerType = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  birthday: Date | null;
  nationality: string | null;
  active: boolean;
  team: TeamType | null;
};

type Props = Readonly<{
  session: Session;
  player: PlayerType;
  teams: TeamType[];
}>;

export const EditPlayerForm: FC<Props> = ({ session, player, teams }) => {
  const { form, onSubmit, handleNavigateBack } = useEditPlayer({ session, player });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormFields teams={teams} />

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={handleNavigateBack}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
            aria-label="Actualizar jugador"
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span
                  className="text-sm italic"
                  role="status"
                  aria-label="Enviando formulario"
                >
                  Espere
                </span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              <span>actualizar</span>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
