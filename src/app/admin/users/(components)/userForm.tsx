'use client';

import { useState, type FC } from 'react';
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { createUserSchema, editUserSchema } from '@/shared/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserAction } from '../(actions)';
import { Session } from 'next-auth';
import { type User } from '@/root/next-auth';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Eye, EyeClosed } from 'lucide-react';
import { Role } from '@/shared/interfaces';
import { updateUserAction } from '../(actions)/updateUserAction';

const roles = [
  { value: "user", label: "Usuario" },
  { value: "admin", label: "Administrador" },
];

type Props = Readonly<{
  session: Session;
  user?: User;
}>;

export const UserForm: FC<Props> = ({ session, user }) => {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const formSchema = !user ? createUserSchema : editUserSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      passwordConfirmation: '',
      roles: (user?.roles && (user?.roles as string[]).length > 0)
        ? user.roles.map((role) => role as Role)
        : ['user'],
      isActive: user?.isActive ?? false,
    }
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const formData = new FormData();

    
    formData.append('name', data.name as string);
    if (data.username) formData.append('username', data.username);
    formData.append('email', data.email as string);
    if (data.image && typeof data.image === 'object') {
      formData.append("image", data.image);
    }
    formData.append('password', data.password as string);
    formData.append('passwordConfirmation', data.passwordConfirmation as string);
    formData.append('roles', JSON.stringify(data.roles));
    formData.append('isActive', String(data.isActive ?? false));

    // Create user
    if (!user) {
      const response = await createUserAction(
        formData,
        session?.user.roles ?? null
      );

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        form.reset();
        route.replace("/admin/users");
        return;
      }
      return;
    }

    if (user) {
      const response = await updateUserAction({
        formData,
        userId: user.id,
        userRoles: session.user.roles,
        authenticatedUserId: session?.user.id,
      });

      if (!response.ok) {
        toast.error(response.message);
        return;
      }

      if (response.ok) {
        toast.success(response.message);
        route.replace("/admin/users");
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
        {/* Name and Username */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre
                  </FormLabel>
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Nombre de usuario
                  </FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Email and Image URL */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Correo Electrónico
                  </FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Imagen
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      {
                        (field.value as string).length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                          >
                            {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                          </button>
                        )
                      }
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPasswordConfirmation ? "text" : "password"}
                        {...field}
                      />
                      {
                        (field.value as string).length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(prev => !prev)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                          >
                            {showPasswordConfirmation ? <Eye size={16} /> : <EyeClosed size={16} />}
                          </button>
                        )
                      }
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Roles and isActive */}
        <div className="flex flex-col gap-5 lg:flex-row">
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Roles</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline-secondary"
                          role="combobox"
                          className="w-[200px] justify-between"
                        >
                          {((field.value as string[]).length > 0)
                            ? `${(field.value as string[]).length} rol${(field.value as string[]).length < 2 ? '' : 'es'} seleccionado${(field.value as string[]).length < 2 ? '' : 's'}`
                            : "Seleccione un rol"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>No se encontraron roles.</CommandEmpty>
                            <CommandGroup>
                              {roles.map((role) => (
                                <CommandItem
                                  key={role.value}
                                  value={role.value}
                                  onSelect={(currentValue) => {
                                    const currentRoles = field.value || [];
                                    if (currentRoles.includes(currentValue as Role)) {
                                      // Remove if already selected
                                      field.onChange(currentRoles.filter(r => r !== currentValue));
                                    } else {
                                      // Add role if not selected
                                      field.onChange([...currentRoles, currentValue]);
                                    }
                                  }}
                                >
                                  {role.label}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value?.includes(role.value as Role) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  {(field.value as string[]).length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {(field.value as string[]).map((roleValue) => {
                        const role = roles.find(r => r.value === roleValue);
                        return (
                          <Badge key={roleValue} variant="secondary" className="text-xs">
                            {role?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-full lg:w-1/2">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Switch
                        id="isActive"
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <Label htmlFor="isActive">Activo</Label>
                  </div>
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
          >
            {!user ? 'crear' : 'actualizar'}
          </Button>
        </div>
      </form>
    </Form>
  );

};

export default UserForm;
