'use client';

import { FC, useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

type Props = Readonly<{
  className?: string;
}>;

export const ThemeSwitcher: FC<Props> = ({ className }) => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {theme === "light" ? (
        <button onClick={() => setTheme("dark")}>
          <Moon className={cn('size-5', className)} />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <Sun className={cn('size-5', className)} />
        </button>
      )}
    </>
  );
};

export default ThemeSwitcher;
