'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { createPenaltyShootoutSchema } from './createPenaltyShootout.schema';
import { toast } from 'sonner';
import type z from 'zod';
import { createPlayoffPenaltyShootoutAction } from '@/app/admin/liguilla/(actions)/create-playoff-penalty-shootout.action';
import { createRegularPenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/create-regular-penalty-shootouts.action';

type Props = Readonly<{
  userRoles: string[] | null | undefined;
  currentMatchId: string;
  localTeam: Team;
  visitorTeam: Team;
  phase: 'regular' | 'playoff';
}>;

type Team = {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
  }[];
}

export const PenaltiesForm: FC<Props> = ({
  userRoles,
  currentMatchId,
  localTeam,
  visitorTeam,
  phase,
}) => {
  const formSchema = createPenaltyShootoutSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      localPlayerId: '',
      visitorPlayerId: '',
      localIsGoal: '',
      visitorIsGoal: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('matchId', currentMatchId);
    formData.append('localTeamId', localTeam.id);
    formData.append('visitorTeamId', visitorTeam.id);

    formData.append('localPlayerId', data.localPlayerId);

    const localPlayerName = localTeam.players.find((p) => {
      return p.id === data.localPlayerId;
    })?.name as string;
    formData.append('localPlayerName', localPlayerName);

    const visitorPlayerName = visitorTeam.players.find((p) => {
      return p.id === data.visitorPlayerId;
    })?.name as string;

    formData.append('visitorPlayerId', data.visitorPlayerId);
    formData.append('visitorPlayerName', visitorPlayerName);
    formData.append('localIsGoal', data.localIsGoal);
    formData.append('visitorIsGoal', data.visitorIsGoal);

    let ok = false;
    let message = '';

    // Create match
    if (phase === 'regular') {
      const response = await createRegularPenaltyShootoutAction(
        formData,
        userRoles,
      );

      ok = response.ok;
      message = response.message;
    }

    if (phase === 'playoff') {
      const response = await createPlayoffPenaltyShootoutAction(
        formData,
        userRoles,
      );

      ok = response.ok;
      message = response.message;
    }

    if (!ok) {
      toast.error(message);
      return;
    }

    if (ok) {
      toast.success(message);
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 items-center gap-5">
              <FormField
                control={form.control}
                name="localPlayerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tirador Local</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione Jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {localTeam.players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="localIsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="scored">Anotado</SelectItem>
                          <SelectItem value="missed">Fallado</SelectItem>
                          <SelectItem value="not-taken">No Realizado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="visitorPlayerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tirador Visitante</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione Jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {visitorTeam.players.map((player) => (
                            <SelectItem key={player.id} value={player.id}>
                              {player.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visitorIsGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccione una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="scored">Anotado</SelectItem>
                          <SelectItem value="missed">Fallado</SelectItem>
                          <SelectItem value="not-taken">No Realizado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="w-full flex lg:justify-end pt-5">
            <Button
              type="submit"
              variant="outline-primary"
              disabled={form.formState.isSubmitting}
              className="w-full lg:w-auto"
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                  <span className="text-sm italic">Espere</span>
                  <LoaderCircle className="size-4 animate-spin" />
                </span>
              ) : (
                <span>guardar</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
