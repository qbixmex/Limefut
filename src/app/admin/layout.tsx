import type { FC, ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { auth } from '@/auth.config';
import { Breadcrumbs } from './(components)/breadcrumbs';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import { NavUser } from '@/components/nav-user';
import './layout.styles.css';

export const metadata: Metadata = {
  title: 'Limefut - Admin',
  description: 'Panel de administración',
  robots: 'noindex, nofollow',
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
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                imageUrl: user.imageUrl,
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