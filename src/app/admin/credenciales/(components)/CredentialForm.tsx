'use client';

import { useState, type FC } from 'react';
import { useRouter } from "next/navigation";
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import type { Session } from 'next-auth';
import { Button } from '@/components/ui/button';
import { createCredentialSchema, editCredentialSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import type { PlayerForCredential } from '../(actions)/fetchPlayersForCredentialForm';
import type { Credential } from '@/shared/interfaces';
import { createCredentialAction, updateCredentialAction } from '../(actions)';
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/root/src/components/ui/popover';
import type z from 'zod';

type Props = Readonly<{
  session: Session;
  players: PlayerForCredential[];
  credential?: Credential;
}>;

export const CredentialForm: FC<Props> = ({ session, credential, players }) => {
  const route = useRouter();
  const formSchema = !credential ? createCredentialSchema : editCredentialSchema;

  // Full Name Combobox state
  const [comboBoxOpen, setComboBoxOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: credential?.fullName ?? '',
      playerId: credential?.player?.id ?? '',
      curp: credential?.curp ?? '',
      position: credential?.position ?? '',
      jerseyNumber: credential?.jerseyNumber ?? 0,
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    formData.append('fullName', data.fullName as string);
    formData.append('playerId', data.playerId as string);
    formData.append('curp', data.curp as string);
    formData.append('position', data.position as string);
    formData.append('jerseyNumber', (data.jerseyNumber as number).toString());

    // Create credential
    if (!credential) {
      const response = await createCredentialAction(
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
        route.replace("/admin/credenciales");
        return;
      }
      return;
    }
    
    // Update credential
    if (credential) {
      const response = await updateCredentialAction({
        formData,
        id: credential.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/credenciales");
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
        {/* Full Name and CURP */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => {
                const selectedPlayer = players.find((p) => p.name === field.value);
                return (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <Popover open={comboBoxOpen} onOpenChange={setComboBoxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          aria-expanded={comboBoxOpen}
                          className="w-full justify-between border-input dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
                        >
                          {selectedPlayer ? selectedPlayer.name : "Selecciona un jugador..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Buscar jugador..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontró jugador.</CommandEmpty>
                            <CommandGroup>
                              {players.map((player) => (
                                <CommandItem
                                  key={player.id}
                                  value={player.name}
                                  onSelect={(currentValue) => {
                                    field.onChange(currentValue);
                                    const selected = players.find((player) => player.name === currentValue);
                                    if (selected) {
                                      form.setValue('playerId', selected.id);
                                    }
                                    setComboBoxOpen(false);
                                  }}
                                >
                                  {player.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === player.name ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="curp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CURP</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      placeholder="Ejemplo: ABCD123456MDFEFG00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/*  and Position */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posición</FormLabel>
                  <FormControl>
                    <Input
                      {...field} value={field.value ?? ''}
                      placeholder="Ejemplo: Mediocampista"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="jerseyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. de camiseta</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      className="w-[75px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              !credential ? 'crear' : 'actualizar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default CredentialForm;
