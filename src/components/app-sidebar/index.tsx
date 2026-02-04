"use client";

import type { ComponentProps, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { navMain, navLinks } from "./data";
import { NavMain } from "@/components/nav-main";
import { NavLinks } from "@/components/nav-links";

type Props = Readonly<ComponentProps<typeof Sidebar>>;

export const AppSidebar: FC<Props> = ({ ...props }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-green-600 dark:bg-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
                  <Image
                    src="/limefut-logo-white.webp"
                    width={20}
                    height={20}
                    alt="Limefut Logo"
                    className="w-5 h-auto"
                  />
                </div>
                <div className="leading-none">
                  <span className="text-lg font-bold text-green-800 dark:text-primary/80">
                    Limefut
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
