'use client';

import type { FC} from "react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import Link from "next/link";
import React from "react";
import {
  ChevronsUpDown,
  LayoutDashboard,
  UserCircle,
  LogOut,
} from "lucide-react";
import { logoutAction } from '@/app/(auth)/handleLogout';
import { toast } from "sonner";

type Props = Readonly<{
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string;
    imageUrl?: string | null;
  }
}>;

export const AuthNav: FC<Props> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onLogout = async () => {
    toast.success('¡ Has cerrado sesión correctamente 👍 !');
    setIsOpen(false);
    await logoutAction();
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
            src={user.imageUrl ?? undefined}
            alt={user.name ? `${user.name} profile image` : ''}
          />
          <AvatarFallback className="rounded-lg">{(user.name as string).at(0)}</AvatarFallback>
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
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </Link>
            <Link
              href={`/admin/users/profile/${user.id}`}
              className="flex items-center gap-3 w-full font-bold py-3 text-emerald-50 hover:text-emerald-300 transition-colors"
              onClick={() => setIsOpen(false)}
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
