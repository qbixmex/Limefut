import type { FC, ReactNode } from 'react';
import { redirect } from "next/navigation";
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/auth.config';
import { Breadcrumbs } from '../(components)/breadcrumbs';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import { NavUser } from '@/components/nav-user';

type Props = Readonly<{ children: ReactNode; }>;

export const MainLayout:FC<Props> = async ({ children }) => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="header">
          <div className="headerLeft">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumbs />
          </div>
          <section className="headerRight">
            <ThemeSwitcher />
            <NavUser
              user={{
                id: session.user.id,
                name: session.user.name,
                username: session.user.username,
                email: session.user.email,
                imageUrl: session.user.imageUrl,
              }}
            />
          </section>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
