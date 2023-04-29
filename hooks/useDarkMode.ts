import { useEffect } from "react";

const THEME_MODE = "theme-mode"
enum themes {
    default = 'light',
    dark = 'dark'
}

const useDarkMode = () => {
    const storeTheme = (theme: string) => {
        localStorage.setItem(THEME_MODE, theme);
    }
    const readTheme = (): string | null => {
        return localStorage.getItem(THEME_MODE)
    }
    const updateTheme = (newTheme: string, prevTheme?: string | null) => {
        const { classList } = document.documentElement;
        if (prevTheme) classList.remove(prevTheme);
        classList.add(newTheme);
    }
    const toggleTheme = () => {
        const savedTheme = readTheme();
        const newTheme = savedTheme === themes.default ? themes.dark : themes.default
        updateTheme(newTheme, savedTheme);
        storeTheme(newTheme)
    }

    useEffect(() => {
        const savedTheme = readTheme();
        if (savedTheme) {
            return updateTheme(savedTheme)
        }
        const osDark = window.matchMedia('(prefers-color-scheme: dark').matches;
        if (osDark) {
            updateTheme(themes.dark);
            storeTheme(themes.dark);
        } else {
            updateTheme(themes.default);
            storeTheme(themes.default);
        }
    }, [])

    return { toggleTheme };


}

export default useDarkMode;