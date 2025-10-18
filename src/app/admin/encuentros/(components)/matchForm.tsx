'use client';

import { type FC } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createMatchSchema, editMatchSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Session } from 'next-auth';
import { toast } from 'sonner';
import type { Match, Tournament } from '@/shared/interfaces';
import { createMatchAction, updateMatchAction } from '../(actions)';
import { LoaderCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MATCH_STATUS } from '@/shared/enums';

type Props = Readonly<{
  session: Session;
  match?: Match;
  tournaments: Pick<Tournament, 'id' | 'name'>[];
}>;

export const MatchForm: FC<Props> = ({ session, match, tournaments }) => {
  const route = useRouter();
  const formSchema = !match ? createMatchSchema : editMatchSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      local: match?.local ?? '',
      visitor: match?.visitor ?? '',
      place: match?.place ?? '',
      matchDate: match?.matchDate ?? new Date(2000, 1, 1),
      week: match?.week ?? 1,
      referee: match?.referee ?? '',
      status: match?.status ?? MATCH_STATUS.SCHEDULED,
      tournamentId: '',
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('local', data.local as string);
    formData.append('visitor', data.visitor as string);
    formData.append('place', data.place as string);
    formData.append('matchDate', (data.matchDate as Date).toISOString());
    formData.append('week', (data.week as number).toString());
    formData.append('referee', data.referee as string);
    formData.append('status', data.status as string);
    formData.append('tournamentId', data.tournamentId as string);

    // Create match
    if (!match) {
      const response = await createMatchAction(
        formData,
        session?.user.roles ?? null,
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        route.replace("/admin/encuentros");
        return;
      }
      return;
    }

    // Update match
    if (match) {
      const response = await updateMatchAction({
        formData,
        playerId: match.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/encuentros");
        return;
      }
      return;
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        {/* Local and Visitor */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Local</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="visitor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Equipo Visitante</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Place and week */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sede</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="referee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arbitro</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Match Date and Referee */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col gap-2">
              <FormLabel>Fecha del encuentro</FormLabel>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Día"
                  min={1}
                  max={31}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'd') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setDate(parseInt(e.target.value) || 1);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Mes"
                  min={1}
                  max={12}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'M') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setMonth((parseInt(e.target.value) || 1) - 1);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Año"
                  min={2000}
                  value={form.watch('matchDate') ? format(form.watch('matchDate') as Date, 'yyyy') : ''}
                  onChange={(e) => {
                    const currentDate = form.watch('matchDate') as Date || new Date();
                    const newDate = new Date(currentDate);
                    newDate.setFullYear(parseInt(e.target.value) || 2000);
                    form.setValue('matchDate', newDate);
                  }}
                  className="w-24"
                />
                <FormField
                  control={form.control}
                  name="matchDate"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className="text-sm text-gray-400 italic">
                  {format(form.watch('matchDate') as Date, "d 'de' MMMM 'del' yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-end gap-5">
            <div>
              <FormField
                control={form.control}
                name="tournamentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Torneo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un torneo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tournaments.map(({ id, name }) => (
                          <SelectItem key={id} value={id as string}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jornada</FormLabel>
                    <FormControl>
                      <Input
                        id="week"
                        type="number"
                        {...field}
                        min={1}
                        max={100}
                        className="w-[75px]"
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
                        <SelectItem value={MATCH_STATUS.INPROGRESS}>En Progreso</SelectItem>
                        <SelectItem value={MATCH_STATUS.COMPLETED}>Finalizado</SelectItem>
                        <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
                        <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline-secondary"
            size="lg"
            onClick={() => route.back()}
          >
            cancelar
          </Button>
          <Button
            type="submit"
            variant="outline-primary"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span className="flex items-center gap-2 text-secondary-foreground animate-pulse">
                <span className="text-sm italic">Espere</span>
                <LoaderCircle className="size-4 animate-spin" />
              </span>
            ) : (
              !match ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default MatchForm;
