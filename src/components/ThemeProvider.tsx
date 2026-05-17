"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { themes, applyTheme, ThemeKey, ColorScheme } from "@/lib/themes";

interface ThemeContextValue {
  themeKey: ThemeKey;
  colorScheme: ColorScheme;
  isDark: boolean;
  setThemeKey: (key: ThemeKey) => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeKey: "dusk",
  colorScheme: "system",
  isDark: false,
  setThemeKey: () => {},
  setColorScheme: () => {},
});

const STORAGE_THEME = "nova-theme";
const STORAGE_SCHEME = "nova-color-scheme";

function detectSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveIsDark(scheme: ColorScheme): boolean {
  if (scheme === "system") return detectSystemDark();
  return scheme === "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>("dusk");
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (localStorage.getItem(STORAGE_THEME) as ThemeKey) || "dusk";
    const savedScheme =
      (localStorage.getItem(STORAGE_SCHEME) as ColorScheme) || "system";
    setThemeKeyState(savedTheme);
    setColorSchemeState(savedScheme);
    const dark = resolveIsDark(savedScheme);
    setIsDark(dark);
    applyTheme(themes[savedTheme], dark);
    setMounted(true);
  }, []);

  // React to system preference changes when on "system"
  useEffect(() => {
    if (colorScheme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
      applyTheme(themes[themeKey], e.matches);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [colorScheme, themeKey]);

  const setThemeKey = useCallback(
    (key: ThemeKey) => {
      setThemeKeyState(key);
      applyTheme(themes[key], isDark);
      localStorage.setItem(STORAGE_THEME, key);
    },
    [isDark]
  );

  const setColorScheme = useCallback(
    (scheme: ColorScheme) => {
      setColorSchemeState(scheme);
      const dark = resolveIsDark(scheme);
      setIsDark(dark);
      applyTheme(themes[themeKey], dark);
      localStorage.setItem(STORAGE_SCHEME, scheme);
    },
    [themeKey]
  );

  return (
    <ThemeContext.Provider
      value={{ themeKey, colorScheme, isDark, setThemeKey, setColorScheme }}
    >
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
