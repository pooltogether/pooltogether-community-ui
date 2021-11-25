export interface LegacyButtonClassNameProps {
    border?: string;
    bg?: string;
    bold?: boolean;
    text?: string;
    hoverBg?: string;
    hoverBorder?: string;
    hoverText?: string;
    noAnim?: boolean;
    padding?: string;
    rounded?: string;
    inverse?: boolean;
    basic?: boolean;
    secondary?: boolean;
    tertiary?: boolean;
    selected?: boolean;
    transition?: string;
    className?: string;
    textSize?: string;
    width?: string;
    disabled?: boolean;
}
export declare function getLegacyButtonClassNames(props: LegacyButtonClassNameProps): string;
