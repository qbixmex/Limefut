import type { FC, ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { auth } from '@/auth';
import { Breadcrumbs } from '../(components)/breadcrumbs';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import { NavUser } from '@/components/nav-user';
import type { User } from '~/next-auth';
import { redirect } from 'next/navigation';

type Props = Readonly<{ children: ReactNode; }>;

export const MainLayout:FC<Props> = async ({ children }) => {
  const session = await auth();

  if (!session || !session.user.roles.includes('admin')) {
    redirect('/login');
  }

  const user = session!.user as User;

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

export default MainLayout;
