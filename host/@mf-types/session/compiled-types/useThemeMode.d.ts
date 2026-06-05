import { type ThemeMode } from "./theme";
export declare function useThemeMode(): {
    mode: ThemeMode;
    resolved: import("./theme").ResolvedTheme;
    antdTheme: import("antd").ThemeConfig;
    setMode: (next: ThemeMode) => void;
};
