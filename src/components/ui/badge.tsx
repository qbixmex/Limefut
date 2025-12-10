import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-emerald-50 font-bold [a_&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a_&]:hover:bg-secondary/90",
        primary:
          "border-transparent bg-blue-500 text-blue-50 [a_&]:hover:bg-blue-600 dark:[a_&]:hover:bg-blue-700",
        info:
          "border-transparent bg-sky-500 text-sky-50 [a_&]:hover:bg-sky-600 dark:bg-sky-700 dark:[a_&]:hover:bg-sky-800",
        warning:
          "border-transparent bg-amber-500 text-amber-50 [a_&]:hover:bg-amber-600 dark:bg-amber-700 [a_&]:hover:bg-amber-800",
        disabled:
          "border-transparent bg-gray-400 text-white [a_&]:hover:bg-gray-500 dark:bg-gray-600 dark:[a_&]:hover:bg-gray-700",
        danger:
          "border-transparent bg-pink-500 text-pink-50 [a_&]:hover:bg-pink-600 dark:bg-pink-700 dark:[a_&]:hover:bg-pink-800",
        outline:
          "border border-primary py-1 px-2 text-primary [a_&]:hover:bg-primary/80 [a_&]:hover:text-white",
        "outline-primary":
          "border border-blue-500 py-1 px-2 text-blue-500 [a_&]:hover:bg-blue-500/80 [a_&]:hover:text-white",
        "outline-disabled":
          "border border-gray-500 py-1 px-2 text-gray-500 [a_&]:hover:bg-gray-500/80 [a_&]:hover:text-white",
        "outline-secondary":
          "border border-gray-600 py-1 px-2 text-gray-500 [a_&]:hover:bg-gray-500/80 [a_&]:hover:text-white",
        "outline-info":
          "border border-sky-600 py-1 px-2 text-sky-500 [a_&]:hover:bg-sky-500/80 [a_&]:hover:text-white",
        "outline-warning":
          "border border-orange-600 py-1 px-2 text-orange-500 [a_&]:hover:bg-orange-500/80 [a_&]:hover:text-white",
        "outline-success":
          "border border-emerald-600 py-1 px-2 text-emerald-500 [a_&]:hover:bg-emerald-500/80 [a_&]:hover:text-white",
        "outline-danger":
          "border border-pink-600 py-1 px-2 text-pink-500 [a_&]:hover:bg-pink-500/80 [a_&]:hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
