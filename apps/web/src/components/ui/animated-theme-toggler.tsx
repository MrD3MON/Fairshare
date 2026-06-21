"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "~/lib/utils";

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export function AnimatedThemeToggler({
  className,
  duration = 250,
  ...props
}: AnimatedThemeTogglerProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";

    if (
      typeof document === "undefined" ||
      !document.startViewTransition
    ) {
      setTheme(nextTheme);
      return;
    }

    const root = document.documentElement;
    root.style.setProperty("--theme-vt-duration", `${duration}ms`);
    root.classList.add("theme-transitioning");

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    const cleanup = () => {
      root.classList.remove("theme-transitioning");
      root.style.removeProperty("--theme-vt-duration");
    };

    void transition.finished.then(cleanup, cleanup);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden active:scale-95 transition-transform duration-100",
        className
      )}
      {...props}
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300 transform",
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300 transform",
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
