/// <reference types="react" />
export declare const poolToast: {
    dismiss: () => void;
    rainbow: (message: any, options?: {
        transition: ({ children, position, preventExitTransition, done, ...props }: import("react-toastify").ToastTransitionProps) => JSX.Element;
    }) => void;
    success: (message: any, options?: {
        transition: ({ children, position, preventExitTransition, done, ...props }: import("react-toastify").ToastTransitionProps) => JSX.Element;
    }) => void;
    error: (message: any, options?: {
        transition: ({ children, position, preventExitTransition, done, ...props }: import("react-toastify").ToastTransitionProps) => JSX.Element;
    }) => void;
    info: (message: any, options?: {
        transition: ({ children, position, preventExitTransition, done, ...props }: import("react-toastify").ToastTransitionProps) => JSX.Element;
    }) => void;
    warn: (message: any, options?: {
        transition: ({ children, position, preventExitTransition, done, ...props }: import("react-toastify").ToastTransitionProps) => JSX.Element;
    }) => void;
};
