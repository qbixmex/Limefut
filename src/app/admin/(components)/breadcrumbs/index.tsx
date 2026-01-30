'use client';

import { Activity } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { validate as isUUID } from "uuid";
import Link from "next/link";

export const Breadcrumbs = () => {
  const path = usePathname();

  const pathSegments = path.split('/').filter(segment => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <span className="capitalize">{pathSegments[0].replaceAll('-', ' ')}</span>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block">
          <ChevronRight />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>
            <BreadcrumbLink asChild>
              <Link href={`/${pathSegments[0]}/${pathSegments[1]}`}>
                <span className="capitalize">{pathSegments[1].replaceAll('-', ' ')}</span>
              </Link>
            </BreadcrumbLink>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {
          pathSegments.length > 2 && (
            <Activity
              mode={
                ['editar', 'crear', 'detalles', 'perfil'].includes(pathSegments[2].toLowerCase())
                || isUUID(pathSegments[2])
                ? 'hidden' : 'visible'
              }
            >
              <BreadcrumbSeparator className="hidden md:block">
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <span className="capitalize">{pathSegments[2].replaceAll('-', ' ')}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Activity>
          )
        }
        {
          pathSegments.length > 3 && (
            <Activity mode={
              isUUID(pathSegments[3]) ? 'hidden' : 'visible'
            }>
              <BreadcrumbSeparator className="hidden md:block">
                <ChevronRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  <span className="capitalize">{pathSegments[3].replaceAll('-', ' ')}</span>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </Activity>
          )
        }
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
