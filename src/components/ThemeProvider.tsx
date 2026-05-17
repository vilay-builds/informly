"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { themes, applyTheme, ThemeKey } from "@/lib/themes";

interface ThemeContextValue {
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeKey: "dusk",
  setThemeKey: () => {},
});

const STORAGE_KEY = "nova-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>("dusk");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeKey) || "dusk";
    setThemeKeyState(saved);
    applyTheme(themes[saved]);
    setMounted(true);
  }, []);

  const setThemeKey = (key: ThemeKey) => {
    setThemeKeyState(key);
    applyTheme(themes[key]);
    localStorage.setItem(STORAGE_KEY, key);
  };

  return (
    <ThemeContext.Provider value={{ themeKey, setThemeKey }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
