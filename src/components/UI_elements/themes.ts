// Copyright 2021 University of Nottingham Ningbo China
// Author: Filippo Savi <filssavi@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


/// The palettes of the interface. This is the one place where the colors are defined: `applyTheme` publishes them as
/// CSS variables (which `ColorTheme` refers to), while the things that cannot use CSS variables (plotly, xterm) read the
/// concrete values of the active palette directly. The theme is chosen once at startup, switching reloads the page.

export type ThemeName = "dark" | "light";

export interface Palette {
    level_1: string, level_2: string, level_3: string, level_4: string, level_5: string,
    accents: string, transparent_accents: string,
    select_background: string, borders: string, bordersLight: string,
    text: string, icons_color: string, disabled_icon_color: string, inactive_icons_color: string,
    plot_palette: readonly string[],
    plot_background: string, plot_foreground: string, plot_grid: string,
    terminal: Record<string, string>,
}

const dark: Palette = {
    level_1: "#121212",
    level_2: "rgba(255,255,255,0.07)",
    level_3: "rgba(255,255,255,0.08)",
    level_4: "rgba(255,255,255,0.11)",
    level_5: "rgba(255,255,255,0.11)",
    accents: "rgba(255,181,69,1)",
    transparent_accents: "rgba(255,181,69,0.7)",
    select_background: "#444444",
    borders: "#434343",
    bordersLight: "#636363",
    text: "rgba(255, 255, 255, 0.87)",
    icons_color: "rgba(255, 255, 255, 0.87)",
    disabled_icon_color: "rgba(140, 140, 140, 0.87)",
    inactive_icons_color: "rgba(255, 255, 255, 0.27)",
    plot_palette: [
        "rgb(161, 201,244)",
        "rgb(141, 229,161)",
        "rgb(255, 159,155)",
        "rgb(208, 187,255)",
        "rgb(255, 254,163)",
        "rgb(185, 242,240)",
    ],
    plot_background: "#444444",
    plot_foreground: "#FFFFFF",
    plot_grid: "#777777",
    terminal: {
        background: "#0c0c0c",
        foreground: "#e6e6e6",
        cursor: "#ffb545",
        cursorAccent: "#0c0c0c",
        selectionBackground: "rgba(255,181,69,0.3)",
        // the default dark blue is hard to read on a dark background
        black: "#1e1e1e",
        red: "#ff6b6b",
        green: "#7ee787",
        yellow: "#f5d76e",
        blue: "#6cb6ff",
        magenta: "#d2a8ff",
        cyan: "#56d4dd",
        white: "#e6e6e6",
        brightBlack: "#6e7681",
        brightRed: "#ff8e8e",
        brightGreen: "#9ef0a6",
        brightYellow: "#ffe58f",
        brightBlue: "#9ccbff",
        brightMagenta: "#e2c5ff",
        brightCyan: "#86e8ef",
        brightWhite: "#ffffff",
    },
};

const light: Palette = {
    level_1: "#ececee",
    level_2: "rgba(0,0,0,0.04)",
    level_3: "rgba(0,0,0,0.05)",
    level_4: "rgba(0,0,0,0.09)",
    level_5: "rgba(0,0,0,0.09)",
    accents: "rgba(255,181,69,1)",
    transparent_accents: "rgba(255,181,69,0.55)",
    select_background: "#f6f6f7",
    borders: "#d0d0d4",
    bordersLight: "#b0b0b6",
    text: "rgba(0, 0, 0, 0.87)",
    icons_color: "rgba(0, 0, 0, 0.75)",
    disabled_icon_color: "rgba(140, 140, 140, 0.87)",
    inactive_icons_color: "rgba(0, 0, 0, 0.35)",
    // the pastel colors of the dark theme do not stand out on a light background
    plot_palette: [
        "rgb(31, 119, 180)",
        "rgb(44, 160, 44)",
        "rgb(214, 39, 40)",
        "rgb(148, 103, 189)",
        "rgb(196, 160, 0)",
        "rgb(23, 154, 160)",
    ],
    plot_background: "#f6f6f7",
    plot_foreground: "#222222",
    plot_grid: "#d6d6da",
    terminal: {
        background: "#f6f6f7",
        foreground: "#24292f",
        cursor: "#c47f00",
        cursorAccent: "#f6f6f7",
        selectionBackground: "rgba(255,181,69,0.35)",
        black: "#24292f",
        red: "#cf222e",
        green: "#1a7f37",
        yellow: "#9a6700",
        blue: "#0969da",
        magenta: "#8250df",
        cyan: "#1b7c83",
        white: "#6e7781",
        brightBlack: "#57606a",
        brightRed: "#a40e26",
        brightGreen: "#116329",
        brightYellow: "#7d4e00",
        brightBlue: "#0550ae",
        brightMagenta: "#6639ba",
        brightCyan: "#136061",
        brightWhite: "#8c959f",
    },
};

export const palettes: Record<ThemeName, Palette> = {dark, light};

export type ThemePreference = ThemeName | "system";

const STORAGE_KEY = "uscope_theme";

const read_preference = (): ThemePreference => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if(stored === "dark" || stored === "light") return stored;
    } catch {}
    return "system";
};

const system_query = window.matchMedia?.("(prefers-color-scheme: light)");

export const themePreference: ThemePreference = read_preference();
export const activeTheme: ThemeName = themePreference !== "system"
    ? themePreference
    : (system_query?.matches ? "light" : "dark");
export const activePalette: Palette = palettes[activeTheme];

/// the CSS variable holding a color of the palette
export const cssVar = (name: keyof Palette) => `var(--${String(name).replace(/_/g, "-")})`;

/// publishes the active palette as CSS variables on the root element
export const applyTheme = () => {
    const root = document.documentElement;
    for(const [name, value] of Object.entries(activePalette)){
        if(typeof value === "string") root.style.setProperty(`--${name.replace(/_/g, "-")}`, value);
    }
    root.style.colorScheme = activeTheme;
    root.dataset.theme = activeTheme;
};

/// the plots and the terminal take concrete colors, so the page is reloaded to rebuild them
export const setTheme = (theme: ThemePreference) => {
    try {
        if(theme === "system") localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
    window.location.reload();
};

// following the system: a change of the system theme rebuilds the page like a manual switch would
if(themePreference === "system"){
    system_query?.addEventListener("change", () => window.location.reload());
}
