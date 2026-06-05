import { type ThemeConfig } from "antd";
export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export declare const THEME_STORAGE_KEY = "app_theme_mode";
export declare function getThemeMode(): ThemeMode;
export declare function resolveTheme(mode: ThemeMode): ResolvedTheme;
export declare function applyTheme(mode?: ThemeMode): ResolvedTheme;
export declare function setThemeMode(mode: ThemeMode): void;
export declare function buildAntdThemeConfig(resolved: ResolvedTheme): ThemeConfig;
/** 在 React 挂载前调用，避免首屏主题闪烁 */
export declare function initTheme(): void;
export declare function subscribeThemeChange(listener: () => void): () => void;
