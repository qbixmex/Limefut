'use client';

import { LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/handleLogout";
import { toast } from "sonner";

export const SignOut = () => {
  const handleLogout = () => {
    logoutAction();
    toast.success("Has Cerrado Sesión Satisfactoriamente");
  };

  return (
    <button onClick={handleLogout} title="Salir">
      <LogOut className="icon" />
    </button>
  );
};

export default SignOut;
