export type ThemeKey =
  | "dusk"
  | "papaya"
  | "forest"
  | "rose"
  | "aurum"
  | "midnight";

export interface Theme {
  key: ThemeKey;
  name: string;
  subtitle: string;
  preview: [string, string, string];
  // Primary palette (used across UI)
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  // Subtle background hue applied to the page
  bgHue: string;
  bgHueStrong: string;
  // Accent palette for "Why It Matters" etc
  accent: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
  };
}

export const themes: Record<ThemeKey, Theme> = {
  dusk: {
    key: "dusk",
    name: "Dusk",
    subtitle: "Twilight & calm",
    preview: ["#5b6ef2", "#7b93f8", "#a4b8fc"],
    primary: {
      50: "#f0f4ff",
      100: "#e0e9ff",
      200: "#c7d6fe",
      300: "#a4b8fc",
      400: "#7b93f8",
      500: "#5b6ef2",
      600: "#4a54e6",
      700: "#3d42cb",
      800: "#3438a4",
      900: "#2f3482",
    },
    bgHue: "#f4f5fc",
    bgHueStrong: "#e8eafa",
    accent: {
      50: "#fff5f0",
      100: "#ffe8db",
      200: "#ffd1b8",
      300: "#ffb08a",
      400: "#ff8a5c",
      500: "#ff6b35",
      600: "#f04e1a",
      700: "#c73c12",
      800: "#9e3214",
    },
  },
  papaya: {
    key: "papaya",
    name: "Papaya",
    subtitle: "Warm & bold",
    preview: ["#ff6b35", "#ff8a5c", "#ffb08a"],
    primary: {
      50: "#fff5f0",
      100: "#ffe8db",
      200: "#ffd1b8",
      300: "#ffb08a",
      400: "#ff8a5c",
      500: "#ff6b35",
      600: "#f04e1a",
      700: "#c73c12",
      800: "#9e3214",
      900: "#802c15",
    },
    bgHue: "#fdf5f0",
    bgHueStrong: "#fbe6d8",
    accent: {
      50: "#f0f4ff",
      100: "#e0e9ff",
      200: "#c7d6fe",
      300: "#a4b8fc",
      400: "#7b93f8",
      500: "#5b6ef2",
      600: "#4a54e6",
      700: "#3d42cb",
      800: "#3438a4",
    },
  },
  forest: {
    key: "forest",
    name: "Forest",
    subtitle: "Fresh & natural",
    preview: ["#059669", "#34d399", "#6ee7b7"],
    primary: {
      50: "#ecfdf5",
      100: "#d1fae5",
      200: "#a7f3d0",
      300: "#6ee7b7",
      400: "#34d399",
      500: "#10b981",
      600: "#059669",
      700: "#047857",
      800: "#065f46",
      900: "#064e3b",
    },
    bgHue: "#f0faf5",
    bgHueStrong: "#daf3e6",
    accent: {
      50: "#fef3c7",
      100: "#fde68a",
      200: "#fcd34d",
      300: "#fbbf24",
      400: "#f59e0b",
      500: "#d97706",
      600: "#b45309",
      700: "#92400e",
      800: "#78350f",
    },
  },
  rose: {
    key: "rose",
    name: "Rose",
    subtitle: "Soft & vivid",
    preview: ["#e11d48", "#fb7185", "#fda4af"],
    primary: {
      50: "#fff1f2",
      100: "#ffe4e6",
      200: "#fecdd3",
      300: "#fda4af",
      400: "#fb7185",
      500: "#f43f5e",
      600: "#e11d48",
      700: "#be123c",
      800: "#9f1239",
      900: "#881337",
    },
    bgHue: "#fdf5f6",
    bgHueStrong: "#fce4e8",
    accent: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
    },
  },
  aurum: {
    key: "aurum",
    name: "Aurum",
    subtitle: "Rich & golden",
    preview: ["#d97706", "#fbbf24", "#fde68a"],
    primary: {
      50: "#fffbeb",
      100: "#fef3c7",
      200: "#fde68a",
      300: "#fcd34d",
      400: "#fbbf24",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
      800: "#92400e",
      900: "#78350f",
    },
    bgHue: "#fef9ec",
    bgHueStrong: "#fbeec8",
    accent: {
      50: "#fdf4ff",
      100: "#fae8ff",
      200: "#f5d0fe",
      300: "#f0abfc",
      400: "#e879f9",
      500: "#d946ef",
      600: "#c026d3",
      700: "#a21caf",
      800: "#86198f",
    },
  },
  midnight: {
    key: "midnight",
    name: "Midnight",
    subtitle: "Dark & dramatic",
    preview: ["#1e1b4b", "#312e81", "#4338ca"],
    primary: {
      50: "#eef2ff",
      100: "#e0e7ff",
      200: "#c7d2fe",
      300: "#a5b4fc",
      400: "#818cf8",
      500: "#6366f1",
      600: "#4f46e5",
      700: "#4338ca",
      800: "#3730a3",
      900: "#312e81",
    },
    bgHue: "#eef0fa",
    bgHueStrong: "#dcdfee",
    accent: {
      50: "#fdf2f8",
      100: "#fce7f3",
      200: "#fbcfe8",
      300: "#f9a8d4",
      400: "#f472b6",
      500: "#ec4899",
      600: "#db2777",
      700: "#be185d",
      800: "#9d174d",
    },
  },
};

export const themeList = Object.values(themes);

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  Object.entries(theme.primary).forEach(([k, v]) => {
    root.style.setProperty(`--color-primary-${k}`, v);
  });
  Object.entries(theme.accent).forEach(([k, v]) => {
    root.style.setProperty(`--color-accent-${k}`, v);
  });
  root.style.setProperty("--color-background", theme.bgHue);
  root.style.setProperty("--color-bg-hue-strong", theme.bgHueStrong);
}
