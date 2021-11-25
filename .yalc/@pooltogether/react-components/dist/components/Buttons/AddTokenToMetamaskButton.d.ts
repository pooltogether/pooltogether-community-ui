import React from 'react';
import { Token } from '@pooltogether/hooks';
export interface IAddTokenToMetamaskButtonProps {
    t: object;
    isMetaMask: boolean;
    isWalletOnProperNetwork: boolean;
    chainId: number;
    token: Token;
    className?: string;
    children?: React.ReactNode;
}
export declare function AddTokenToMetamaskButton(props: any): JSX.Element;
export declare namespace AddTokenToMetamaskButton {
    var defaultProps: {
        className: string;
    };
}
