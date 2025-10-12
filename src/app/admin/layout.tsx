import { FC, ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { NavUser } from "@/components/nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { auth } from "@/auth.config";
import { Breadcrumbs } from "./(components)/breadcrumbs";
import { ThemeSwitcher } from "@/shared/theme/ThemeSwitcher";

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

  const user = session!.user;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center gap-5 px-5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs />
          </div>
          <section className="flex items-center gap-3">
            <ThemeSwitcher />
            <NavUser
              user={{
                name: user.name as string,
                email: user.email,
              }}
            />
          </section>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;