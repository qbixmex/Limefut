"use client";

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
import {
  Users,
  Globe,
  ListIcon,
  PlusIcon,
  Flag,
  Trophy,
} from "lucide-react";

import { type NavItem, NavMain } from "@/components/nav-main";
import { type NavLink, NavLinks } from "@/components/nav-links";
import { ComponentProps, FC } from "react";

const navMain: NavItem[] = [
  {
    label: "Usuarios",
    url: "#",
    icon: Users,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "/admin/users",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "/admin/users/create",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Equipos",
    url: "#",
    icon: Flag,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "#",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "#",
        icon: PlusIcon,
      },
    ],
  },
  {
    label: "Torneos",
    url: "#",
    icon: Trophy,
    isActive: false,
    subItems: [
      {
        label: "Lista",
        url: "#",
        icon: ListIcon,
      },
      {
        label: "Crear",
        url: "#",
        icon: PlusIcon,
      },
    ],
  },
];

const navLinks: NavLink[] = [
  {
    label: "Página Principal",
    url: "/",
    icon: Globe,
  },
];

type Props = Readonly<ComponentProps<typeof Sidebar>>;

export const AppSidebar: FC<Props> = ({ ...props }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-primary-foreground flex aspect-square size-8 items-center justify-center rounded">
                  <Image
                    src="/limefut-logo-white.webp"
                    width={72}
                    height={80}
                    alt="Limefut Logo"
                    className="w-auto h-4"
                  />
                </div>
                <div className="leading-none">
                  <span className="text-lg text-primary/80">Limefut</span>
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
        
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
