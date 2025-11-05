'use client';

import type { FC } from "react";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";
import { Moon, Sun } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = Readonly<{
  className?: string;
}>;

export const ThemeSwitcher: FC<Props> = ({ className }) => {
  const { setTheme, resolvedTheme } = useTheme();

  // The theme is not available on the server, so `theme` may be `undefined`
  // on initial rendering. We return null to avoid hydration errors.
  // `resolvedTheme` gives us the actual theme being used ('light' or 'dark').
  // When `theme` is 'system', `resolvedTheme` will be the user's system theme.
  if (!resolvedTheme) {
    return <div className={cn('size-5', className)} />; // Renderiza un placeholder para evitar saltos en el layout
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {resolvedTheme === "light" ? (
          <button onClick={() => setTheme("dark")}>
            <Moon className={cn('size-5', className)} />
          </button>
        ) : (
          <button onClick={() => setTheme("light")}>
            <Sun className={cn('size-5', className)} />
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="bottom">
        { resolvedTheme === "light" ? "Modo Obscuro" : "Modo Claro" }
      </TooltipContent>
    </Tooltip>
  );
};

export default ThemeSwitcher;
