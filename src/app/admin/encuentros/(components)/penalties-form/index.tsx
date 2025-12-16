'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import type { Session } from 'next-auth';
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
import { createPenaltyShootoutAction } from '../../(actions)/createPenaltyShootouts';
import type z from 'zod';
import { createPenaltyShootoutSchema } from './createPenaltyShootout.schema';
import { toast } from 'sonner';

type Props = Readonly<{
  session: Session | null;
  currentMatchId: string;
  localTeam: Team;
  visitorTeam: Team;
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
  session,
  currentMatchId,
  localTeam,
  visitorTeam,
}) => {
  const formSchema = createPenaltyShootoutSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      localPlayerId: '',
      visitorPlayerId: '',
      localIsGoal: "",
      visitorIsGoal: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('matchId', currentMatchId);
    formData.append('localTeamId', localTeam.id);
    formData.append('visitorTeamId', visitorTeam.id);

    formData.append('localPlayerId', data.localPlayerId);

    const localPlayerName = localTeam.players.find((p) => {
      return p.id == data.localPlayerId;
    })?.name as string;
    formData.append('localPlayerName', localPlayerName);

    const visitorPlayerName = visitorTeam.players.find((p) => {
      return p.id == data.visitorPlayerId;
    })?.name as string;

    formData.append('visitorPlayerId', data.visitorPlayerId);
    formData.append('visitorPlayerName', visitorPlayerName);
    formData.append('localIsGoal', data.localIsGoal);
    formData.append('visitorIsGoal', data.visitorIsGoal);

    // Create match
    const response = await createPenaltyShootoutAction(
      formData,
      session?.user.roles ?? null,
    );

    console.log("RESPONSE:", response.message);

    if (!response.ok) {
      toast.error(response.message);
      return;
    }

    if (response.ok) {
      toast.success(response.message);
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
                true ? 'crear' : 'actualizar'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PenaltiesForm;
