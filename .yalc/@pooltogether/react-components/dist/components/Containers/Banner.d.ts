import React from 'react';
export declare const BannerTheme: {
    purplePink: string;
    rainbow: string;
    rainbowBorder: string;
    purplePinkBorder: string;
};
interface BannerProps {
    theme?: string;
    defaultBorderRadius: string;
    defaultPadding: string;
    className?: string;
    outerClassName?: string;
    innerClassName?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}
export declare const Banner: {
    (props: BannerProps): JSX.Element;
    defaultProps: {
        theme: string;
        defaultBorderRadius: boolean;
        defaultPadding: boolean;
    };
};
export {};
