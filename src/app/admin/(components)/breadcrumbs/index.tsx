'use client';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export const Breadcrumbs = () => {
  const path = usePathname();

  const pathSegments = path.replaceAll("-", " ").split('/').filter(segment => segment);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          Admin
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem>
          <BreadcrumbPage className="capitalize">
            <BreadcrumbLink href={`/admin/${pathSegments[1]}`}>
              {pathSegments[1]}
            </BreadcrumbLink>
          </BreadcrumbPage>
        </BreadcrumbItem>
        {
          pathSegments.length > 2 && (
            <>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                  {pathSegments[2]}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )
        }
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
