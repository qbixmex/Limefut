import { FC, ReactNode } from "react";
import type { Metadata } from "next";
import { auth } from "@/auth.config";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Limefut - Admin",
  description: "Panel de administración",
  robots: "noindex, nofollow",
};

type Props = Readonly<{ children: ReactNode; }>;

export const AdminLayout: FC<Props> = async ({ children }) => {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return (
    <>{children}</>
  );
};

export default AdminLayout;