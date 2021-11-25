import React from 'react';
export declare const CardTheme: Readonly<{
    default: string;
    purple: string;
}>;
export interface CardProps {
    theme: string;
    sizeClassName: string;
    paddingClassName: string;
    className?: string;
    children?: React.ReactNode;
    style?: object;
    roundedClassName?: string;
    backgroundClassName?: string;
}
export declare const Card: {
    (props: CardProps): JSX.Element;
    defaultProps: {
        paddingClassName: string;
        sizeClassName: string;
        theme: string;
    };
};
