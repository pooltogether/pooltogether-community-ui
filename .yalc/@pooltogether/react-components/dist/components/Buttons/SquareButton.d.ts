import React from 'react';
export declare enum SquareButtonTheme {
    teal = "teal",
    tealOutline = "tealOutline",
    purple = "purple",
    purpleOutline = "purpleOutline",
    orange = "orange",
    orangeOutline = "orangeOutline",
    black = "black",
    blackOutline = "blackOutline",
    rainbow = "rainbow"
}
export declare enum SquareButtonSize {
    sm = "sm",
    md = "md",
    lg = "lg"
}
export interface SquareButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    theme?: SquareButtonTheme;
    size?: SquareButtonSize;
    chevron?: boolean;
}
export declare const SquareButton: React.FC<SquareButtonProps>;
interface SquareLinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    theme?: SquareButtonTheme;
    size?: SquareButtonSize;
    chevron?: boolean;
}
export declare const SquareLink: React.FC<SquareLinkProps>;
export {};
