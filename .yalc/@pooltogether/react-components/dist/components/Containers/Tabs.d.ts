/// <reference types="react" />
export declare const Tabs: ({ children, className }: {
    children: any;
    className: any;
}) => JSX.Element;
export declare const Tab: {
    (props: any): JSX.Element;
    defaultProps: {
        className: string;
        paddingClassName: string;
        textClassName: string;
        tabDeselectedClassName: string;
        tabSelectedClassName: string;
    };
};
export declare const Content: ({ children, className }: {
    children: any;
    className: any;
}) => JSX.Element;
export declare const ContentPane: ({ children, className, isSelected, alwaysPresent }: {
    children: any;
    className: any;
    isSelected: any;
    alwaysPresent: any;
}) => JSX.Element;
