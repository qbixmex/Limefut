import type { FC, ReactNode } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Breadcrumbs } from '../(components)/breadcrumbs';
import { ThemeSwitcher } from '@/shared/theme/ThemeSwitcher';
import { NavUser } from '@/components/nav-user';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

type Props = Readonly<{ children: ReactNode; }>;

export const MainLayout: FC<Props> = async ({ children }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
                id: session?.user?.id as string,
                name: session?.user?.name as string,
                email: session?.user?.email as string,
                username: session?.user?.username,
                image: session?.user?.image,
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
