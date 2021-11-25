/// <reference types="react" />
export declare const TextInputGroupType: Readonly<{
    text: string;
    number: string;
}>;
export declare const TextInputGroup: {
    (props: any): JSX.Element;
    defaultProps: {
        Input: {
            (props: any): JSX.Element;
            defaultProps: {
                marginClassName: string;
                paddingClassName: string;
                borderClassName: string;
                bgClassName: string;
                textClassName: string;
                roundedClassName: string;
            };
        };
        type: string;
    };
};
export declare const RightLabelButton: (props: any) => JSX.Element;
