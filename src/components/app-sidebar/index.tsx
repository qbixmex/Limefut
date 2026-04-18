'use client';

import type { ComponentProps, FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { navMain, navLinks } from './data';
import { NavMain } from '@/components/nav-main';
import { NavLinks } from '@/components/nav-links';
import { PiSoccerBall } from 'react-icons/pi';
import './app-sidebar.css';

type Props = Readonly<{
  siteName: string;
  siteLogo: string | null;
} & ComponentProps<typeof Sidebar>>;

export const AppSidebar: FC<Props> = ({ siteName, siteLogo, ...props }) => {
  return (
    <Sidebar id="admin-sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <figure className="site-logo">
                  {
                    !siteLogo ? (
                      <PiSoccerBall
                        size={24}
                        className="site-logo-icon"
                      />
                    ) : (
                      <Image
                        src={siteLogo}
                        width={72}
                        height={80}
                        alt={`${siteName} logo`}
                        className="site-logo-image"
                        loading="eager"
                      />
                    )
                  }
                </figure>
                <div className="leading-none">
                  <span className="site-name">
                    {siteName}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
        <NavLinks links={navLinks} />
      </SidebarContent>

      <SidebarFooter>
        {/* EMPTY FOR NOW */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
