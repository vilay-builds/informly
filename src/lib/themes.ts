export type ThemeKey =
  | "dusk"
  | "papaya"
  | "forest"
  | "rose"
  | "aurum"
  | "midnight";

export type ColorScheme = "light" | "dark" | "system";

export interface ColorPalette {
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
}

export interface Surface {
  background: string;
  bgHueStrong: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  borderHover: string;
  glass: string;
  glassStrong: string;
  glassSubtle: string;
  glassBorder: string;
}

export interface Theme {
  key: ThemeKey;
  name: string;
  subtitle: string;
  preview: [string, string, string];
  primary: ColorPalette;
  accent: ColorPalette;
  light: Surface;
  dark: Surface;
}

const lightSurface: Surface = {
  background: "#f4f5fc",
  bgHueStrong: "#e8eafa",
  surface: "#ffffff",
  surfaceSecondary: "#f4f6fa",
  textPrimary: "#1a1a2e",
  textSecondary: "#6b7194",
  textTertiary: "#9ca3bf",
  border: "#e8ecf4",
  borderHover: "#d1d8e8",
  glass: "rgba(255, 255, 255, 0.65)",
  glassStrong: "rgba(255, 255, 255, 0.8)",
  glassSubtle: "rgba(255, 255, 255, 0.4)",
  glassBorder: "rgba(255, 255, 255, 0.4)",
};

const darkSurface: Surface = {
  background: "#0e0f1a",
  bgHueStrong: "#16182a",
  surface: "#1a1c2e",
  surfaceSecondary: "#23253b",
  textPrimary: "#f3f4f9",
  textSecondary: "#a3a8c2",
  textTertiary: "#6d7494",
  border: "#2a2d44",
  borderHover: "#363a55",
  glass: "rgba(26, 28, 46, 0.7)",
  glassStrong: "rgba(26, 28, 46, 0.85)",
  glassSubtle: "rgba(26, 28, 46, 0.4)",
  glassBorder: "rgba(255, 255, 255, 0.06)",
};

// Per-theme bg hue overrides for the soft radial gradient
const lightBgHue: Record<ThemeKey, [string, string]> = {
  dusk: ["#f4f5fc", "#e8eafa"],
  papaya: ["#fdf5f0", "#fbe6d8"],
  forest: ["#f0faf5", "#daf3e6"],
  rose: ["#fdf5f6", "#fce4e8"],
  aurum: ["#fef9ec", "#fbeec8"],
  midnight: ["#eef0fa", "#dcdfee"],
};

const darkBgHue: Record<ThemeKey, [string, string]> = {
  dusk: ["#0e0f1a", "#161a30"],
  papaya: ["#150f0a", "#241a12"],
  forest: ["#0a1410", "#0e2018"],
  rose: ["#150c0e", "#241218"],
  aurum: ["#15110a", "#241c0e"],
  midnight: ["#0a0b1c", "#0f1124"],
};

function makeLight(key: ThemeKey): Surface {
  return {
    ...lightSurface,
    background: lightBgHue[key][0],
    bgHueStrong: lightBgHue[key][1],
  };
}
function makeDark(key: ThemeKey): Surface {
  return {
    ...darkSurface,
    background: darkBgHue[key][0],
    bgHueStrong: darkBgHue[key][1],
  };
}

export const themes: Record<ThemeKey, Theme> = {
  dusk: {
    key: "dusk",
    name: "Dusk",
    subtitle: "Twilight & calm",
    preview: ["#5b6ef2", "#7b93f8", "#a4b8fc"],
    primary: {
      50: "#f0f4ff", 100: "#e0e9ff", 200: "#c7d6fe", 300: "#a4b8fc",
      400: "#7b93f8", 500: "#5b6ef2", 600: "#4a54e6", 700: "#3d42cb",
      800: "#3438a4", 900: "#2f3482",
    },
    accent: {
      50: "#fff5f0", 100: "#ffe8db", 200: "#ffd1b8", 300: "#ffb08a",
      400: "#ff8a5c", 500: "#ff6b35", 600: "#f04e1a", 700: "#c73c12",
      800: "#9e3214", 900: "#802c15",
    },
    light: makeLight("dusk"),
    dark: makeDark("dusk"),
  },
  papaya: {
    key: "papaya",
    name: "Papaya",
    subtitle: "Warm & bold",
    preview: ["#ff6b35", "#ff8a5c", "#ffb08a"],
    primary: {
      50: "#fff5f0", 100: "#ffe8db", 200: "#ffd1b8", 300: "#ffb08a",
      400: "#ff8a5c", 500: "#ff6b35", 600: "#f04e1a", 700: "#c73c12",
      800: "#9e3214", 900: "#802c15",
    },
    accent: {
      50: "#f0f4ff", 100: "#e0e9ff", 200: "#c7d6fe", 300: "#a4b8fc",
      400: "#7b93f8", 500: "#5b6ef2", 600: "#4a54e6", 700: "#3d42cb",
      800: "#3438a4", 900: "#2f3482",
    },
    light: makeLight("papaya"),
    dark: makeDark("papaya"),
  },
  forest: {
    key: "forest",
    name: "Forest",
    subtitle: "Fresh & natural",
    preview: ["#059669", "#34d399", "#6ee7b7"],
    primary: {
      50: "#ecfdf5", 100: "#d1fae5", 200: "#a7f3d0", 300: "#6ee7b7",
      400: "#34d399", 500: "#10b981", 600: "#059669", 700: "#047857",
      800: "#065f46", 900: "#064e3b",
    },
    accent: {
      50: "#fef3c7", 100: "#fde68a", 200: "#fcd34d", 300: "#fbbf24",
      400: "#f59e0b", 500: "#d97706", 600: "#b45309", 700: "#92400e",
      800: "#78350f", 900: "#451a03",
    },
    light: makeLight("forest"),
    dark: makeDark("forest"),
  },
  rose: {
    key: "rose",
    name: "Rose",
    subtitle: "Soft & vivid",
    preview: ["#e11d48", "#fb7185", "#fda4af"],
    primary: {
      50: "#fff1f2", 100: "#ffe4e6", 200: "#fecdd3", 300: "#fda4af",
      400: "#fb7185", 500: "#f43f5e", 600: "#e11d48", 700: "#be123c",
      800: "#9f1239", 900: "#881337",
    },
    accent: {
      50: "#f0f9ff", 100: "#e0f2fe", 200: "#bae6fd", 300: "#7dd3fc",
      400: "#38bdf8", 500: "#0ea5e9", 600: "#0284c7", 700: "#0369a1",
      800: "#075985", 900: "#0c4a6e",
    },
    light: makeLight("rose"),
    dark: makeDark("rose"),
  },
  aurum: {
    key: "aurum",
    name: "Aurum",
    subtitle: "Rich & golden",
    preview: ["#d97706", "#fbbf24", "#fde68a"],
    primary: {
      50: "#fffbeb", 100: "#fef3c7", 200: "#fde68a", 300: "#fcd34d",
      400: "#fbbf24", 500: "#f59e0b", 600: "#d97706", 700: "#b45309",
      800: "#92400e", 900: "#78350f",
    },
    accent: {
      50: "#fdf4ff", 100: "#fae8ff", 200: "#f5d0fe", 300: "#f0abfc",
      400: "#e879f9", 500: "#d946ef", 600: "#c026d3", 700: "#a21caf",
      800: "#86198f", 900: "#701a75",
    },
    light: makeLight("aurum"),
    dark: makeDark("aurum"),
  },
  midnight: {
    key: "midnight",
    name: "Midnight",
    subtitle: "Dark & dramatic",
    preview: ["#1e1b4b", "#312e81", "#4338ca"],
    primary: {
      50: "#eef2ff", 100: "#e0e7ff", 200: "#c7d2fe", 300: "#a5b4fc",
      400: "#818cf8", 500: "#6366f1", 600: "#4f46e5", 700: "#4338ca",
      800: "#3730a3", 900: "#312e81",
    },
    accent: {
      50: "#fdf2f8", 100: "#fce7f3", 200: "#fbcfe8", 300: "#f9a8d4",
      400: "#f472b6", 500: "#ec4899", 600: "#db2777", 700: "#be185d",
      800: "#9d174d", 900: "#831843",
    },
    light: makeLight("midnight"),
    dark: makeDark("midnight"),
  },
};

export const themeList = Object.values(themes);

export function applyTheme(theme: Theme, isDark: boolean) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  // Primary + accent (same regardless of light/dark)
  Object.entries(theme.primary).forEach(([k, v]) => {
    root.style.setProperty(`--color-primary-${k}`, v);
  });
  Object.entries(theme.accent).forEach(([k, v]) => {
    root.style.setProperty(`--color-accent-${k}`, v);
  });

  // Surface vars depend on scheme
  const s = isDark ? theme.dark : theme.light;
  root.style.setProperty("--color-background", s.background);
  root.style.setProperty("--color-bg-hue-strong", s.bgHueStrong);
  root.style.setProperty("--color-surface", s.surface);
  root.style.setProperty("--color-surface-secondary", s.surfaceSecondary);
  root.style.setProperty("--color-surface-elevated", s.surface);
  root.style.setProperty("--color-text-primary", s.textPrimary);
  root.style.setProperty("--color-text-secondary", s.textSecondary);
  root.style.setProperty("--color-text-tertiary", s.textTertiary);
  root.style.setProperty("--color-border", s.border);
  root.style.setProperty("--color-border-hover", s.borderHover);
  root.style.setProperty("--color-glass", s.glass);
  root.style.setProperty("--color-glass-strong", s.glassStrong);
  root.style.setProperty("--color-glass-subtle", s.glassSubtle);
  root.style.setProperty("--color-glass-border", s.glassBorder);

  root.setAttribute("data-color-scheme", isDark ? "dark" : "light");
  root.style.colorScheme = isDark ? "dark" : "light";
}
