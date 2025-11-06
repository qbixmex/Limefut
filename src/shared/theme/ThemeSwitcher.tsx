'use client';
import { type FC, useState, useEffect } from "react";
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
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={cn('size-5', className)} />;
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
