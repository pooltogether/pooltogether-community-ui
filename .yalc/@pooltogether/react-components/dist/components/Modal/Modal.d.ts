import React from 'react';
export interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    label: string;
    children: React.ReactNode;
    className?: string;
    widthClassName?: string;
    heightClassName?: string;
    maxWidthClassName?: string;
    maxHeightClassName?: string;
    paddingClassName?: string;
    bgClassName?: string;
    roundedClassName?: string;
    shadowClassName?: string;
    overflowClassName?: string;
    style?: object;
}
export declare const Modal: {
    (props: ModalProps): JSX.Element;
    defaultProps: {
        noPad: boolean;
        noSize: boolean;
        bgClassName: string;
        roundedClassName: string;
        maxWidthClassName: string;
        widthClassName: string;
        heightClassName: string;
        maxHeightClassName: string;
        paddingClassName: string;
        shadowClassName: string;
        overflowClassName: string;
    };
};
