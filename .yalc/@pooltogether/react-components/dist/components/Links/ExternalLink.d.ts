/// <reference types="react" />
export declare const LinkTheme: Readonly<{
    default: string;
    accent: string;
    light: string;
}>;
export declare const ExternalLink: {
    (props: any): JSX.Element;
    defaultProps: {
        underline: boolean;
        noIcon: boolean;
        iconClassName: string;
        openInSameTab: boolean;
        theme: string;
        displayClassName: string;
    };
};
