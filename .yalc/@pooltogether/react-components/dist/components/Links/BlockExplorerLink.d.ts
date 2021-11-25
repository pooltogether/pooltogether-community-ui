/// <reference types="react" />
export declare const BlockExplorerLink: {
    (props: any): JSX.Element;
    defaultProps: {
        noIcon: boolean;
        noText: boolean;
        noUnderline: boolean;
        theme: string;
        iconClassName: string;
    };
};
export declare const formatBlockExplorerTxUrl: (tx: any, networkId: any) => string;
export declare const formatBlockExplorerAddressUrl: (address: any, networkId: any) => string;
