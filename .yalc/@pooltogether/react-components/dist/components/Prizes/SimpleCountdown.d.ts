/// <reference types="react" />
interface SimpleCountDownProps {
    seconds: number;
    t?: (key: string) => string;
}
export declare const SimpleCountDown: (props: SimpleCountDownProps) => JSX.Element;
export {};
