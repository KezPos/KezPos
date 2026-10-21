import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

const KEY = "kez-theme";

/** Inline script: runs before paint so there's no flash. Light is the default. */
export const themeInitScript = `try{if(localStorage.getItem('${KEY}')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(KEY, next ? "dark" : "light");
    } catch {
      /* ignore */
    }
  };

  return (
    <Button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative grid h-10 w-[72px] shrink-0 grid-cols-2 items-center rounded-[var(--radius-btn)] bg-muted p-1 shadow-soft transition-colors"
    >
      <span
        data-dark={dark}
        className="theme-knob absolute top-1 bottom-1 left-1 w-8 rounded-[11px] bg-raised shadow-soft transition-transform duration-300 ease-out"
      />
      <Sun className={`relative mx-auto h-4 w-4 transition-colors ${dark ? "text-muted-foreground" : "text-primary"}`} />
      <Moon className={`relative mx-auto h-4 w-4 transition-colors ${dark ? "text-primary" : "text-muted-foreground"}`} />
    </Button>
  );
}
