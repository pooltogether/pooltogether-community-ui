/// <reference types="react" />
interface SwitchProps {
    enabled: boolean;
    setEnabled: (checked: boolean) => void;
    className?: string;
    borderClassName?: string;
    toggleBgClassName?: string;
}
export declare const Switch: {
    (props: SwitchProps): JSX.Element;
    defaultProps: {
        toggleBgClassName: string;
        borderClassName: string;
    };
};
export {};
