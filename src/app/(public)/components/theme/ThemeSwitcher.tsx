'use client';

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
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
          <Moon className="size-5 text-green-50" />
        </button>
      ) : (
        <button onClick={() => setTheme("light")}>
          <Sun className="size-5 text-green-50" />
        </button>
      )}
    </>
  );
};

export default ThemeSwitcher;
