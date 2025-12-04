import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: [
          "bg-destructive",
          "text-white",
          "hover:bg-destructive/90",
          "focus-visible:ring-destructive/20",
          "dark:focus-visible:ring-destructive/40",
          "dark:bg-destructive/60",
          "dark:hover:bg-destructive/80",
        ],
        outline:
          [
            "bg-background",
            "border",
            "border-primary",
            "bg-transparent",
            "shadow-xs",
            "hover:bg-primary",
            "hover:text-white",
            "dark:bg-input/30",
            "dark:text-primary-foreground",
            "dark:border-primary",
            "dark:hover:bg-input/50",
            "dark:hover:bg-primary",
            "dark:hover:text-white",
          ],
        "outline-primary": [
          // Light Mode
          "border",
          "bg-transparent",
          "border-blue-900",
          "text-blue-900",
          "shadow-xs",
          "hover:border-blue-500",
          "hover:bg-blue-500",
          "hover:text-white",
          // Dark Mode
          "dark:hover:text-blue-50",
          "dark:text-blue-500",
          "dark:border-blue-500",
          "dark:hover:bg-blue-500",
        ],
        "outline-secondary": [
          // Light Mode
          "font-semibold",
          "border",
          "border-gray-300",
          "bg-transparent",
          "shadow-xs",
          "hover:bg-gray-300",
          "hover:text-white",
          // Dark Mode
          "dark:text-gray-500",
          "dark:border-gray-500",
          "dark:hover:border-gray-600",
          "dark:hover:bg-gray-800",
          "dark:hover:text-gray-200",
        ],
        "outline-info": [
          // Light Mode
          "border",
          "bg-transparent",
          "border-sky-900",
          "text-sky-900",
          "shadow-xs",
          "hover:border-sky-500",
          "hover:bg-sky-500",
          "hover:text-white",
          // Dark Mode
          "dark:hover:text-sky-50",
          "dark:text-sky-500",
          "dark:border-sky-500",
          "dark:hover:bg-sky-500",
        ],
        "outline-warning": [
          // Light Mode
          "bg-transparent",
          "border",
          "border-orange-500",
          "shadow-xs",
          "hover:bg-orange-500",
          "hover:text-white",
          // Dark Mode
          "dark:bg-input/30",
          "dark:text-orange-500",
          "dark:border-orange-500",
          "dark:hover:bg-orange-500",
          "dark:hover:text-orange-50",
        ],
        "outline-success": [
          // Light Mode
          "bg-transparent",
          "border",
          "border-emerald-500",
          "text-emerald-800",
          "shadow-xs",
          "hover:bg-orange-500",
          "hover:text-orange-50",
          // Dark Mode
          "dark:border-emerald-500",
          "dark:text-emerald-500",
          "dark:hover:bg-emerald-600",
          "dark:hover:text-white",
        ],
        "outline-danger": [
          // Light Mode
          "bg-transparent",
          "border",
          "border-pink-500",
          "text-pink-800",
          "shadow-xs",
          "hover:bg-orange-500",
          "hover:text-orange-50",
          // Dark Mode
          "dark:border-pink-500",
          "dark:text-pink-500",
          "dark:hover:bg-pink-600",
          "dark:hover:text-white",
        ],
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
