import React from 'react';
export declare enum ColorTheme {
    light = "light",
    dark = "dark"
}
export declare const ThemeContext: React.Context<{
    theme: ColorTheme;
    toggleTheme: () => void;
}>;
export declare function ThemeContextProvider(props: any): JSX.Element;
