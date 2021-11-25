/// <reference types="react" />
interface ErrorsBoxProps {
    errors: {
        [x: string]: {
            message: string;
        };
    };
    className?: string;
    colorClassName: string;
    fontClassName: string;
}
/**
 * Placeholder box for errors with a minium height so components don't jump
 * @param {*} props
 * @returns
 */
export declare function ErrorsBox(props: ErrorsBoxProps): JSX.Element;
export declare namespace ErrorsBox {
    var defaultProps: {
        className: string;
        colorClassName: string;
        fontClassName: string;
    };
}
export {};
