'use client';

import type { FC } from "react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import {
  ChevronsUpDown,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { signOutAction } from "@/app/(auth)/signOutAction";

type Props = Readonly<{
  user: {
    id: string;
    name: string;
    username?: string | null;
    email: string;
    image?: string | null;
    roles?: string[] | null;
  }
}>;

export const AuthNav: FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = async () => {
    await signOutAction();
    toast.success('¡ Has cerrado sesión correctamente 👍 !');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-transparent hover:bg-emerald-500/20 rounded-lg px-4 py-2 transition-colors focus:outline-none"
      >
        {user.username && (
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium text-green-50">
              {user.username ?? user.name?.split(" ").at(0)}
            </span>
          </div>
        )}
        <Avatar className="h-8 w-8 rounded-lg">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name ? `${user.name} profile image` : ''}
          />
          <AvatarFallback className="rounded-lg bg-emerald-900 font-medium text-sm">{(user.name as string).at(0)}</AvatarFallback>
        </Avatar>
        <ChevronsUpDown className="ml-auto size-4 stroke-green-50" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-radial w-[200px] from-emerald-600 to-emerald-800 border border-emerald-700 rounded-lg shadow-lg z-50">
          <div className="px-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 w-full font-bold py-3 text-emerald-50 hover:text-emerald-300 transition-colors"
              onClick={() => setIsOpen(false)}
              target="_blank"
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
            <Link
              href={`/admin/usuarios/perfil/${user.id}`}
              className="flex items-center gap-3 w-full font-bold py-3 text-emerald-50 hover:text-emerald-300 transition-colors"
              onClick={() => setIsOpen(false)}
              target="_blank"
            >
              <UserCircle />
              <span>Perfil</span>
            </Link>
            <button
              className="flex items-center gap-3 w-full font-bold py-3 text-emerald-50 hover:text-emerald-300 transition-colors"
              onClick={onLogout}
            >
              <LogOut />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthNav;
