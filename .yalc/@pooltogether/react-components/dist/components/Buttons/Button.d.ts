import React from 'react';
import { LegacyButtonClassNameProps } from '../../utils/getLegacyButtonClassNames';
interface ButtonProps extends LegacyButtonClassNameProps {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
}
export declare function Button(props: ButtonProps): JSX.Element;
export {};
