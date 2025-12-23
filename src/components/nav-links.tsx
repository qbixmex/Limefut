'use client';

import type { FC } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";


export type NavLink = {
  label: string;
  url: string;
  icon: LucideIcon;
  target: '_blank' | 'self' | 'parent' | 'top';
};

type Props = Readonly<{
  links: NavLink[];
}>;

export const NavLinks: FC<Props> = ({ links }) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Enlaces</SidebarGroupLabel>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.label}>
            <SidebarMenuButton asChild>
              <a href={link.url} target={link.target ?  "_blank" : "_self"}>
                <link.icon />
                <span>{link.label}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};
