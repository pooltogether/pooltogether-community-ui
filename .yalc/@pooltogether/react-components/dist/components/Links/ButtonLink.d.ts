import React from 'react';
import { LegacyButtonClassNameProps } from '../../utils/getLegacyButtonClassNames';
interface ButtonLinkProps extends LegacyButtonClassNameProps {
    children: React.ReactNode;
    ref?: React.Ref<HTMLAnchorElement>;
    href?: string;
    rel?: string;
    type?: string;
    target?: string;
}
export declare const ButtonLink: React.ForwardRefExoticComponent<Pick<ButtonLinkProps, "children" | "href" | "rel" | "type" | "target" | "border" | "bg" | "bold" | "text" | "hoverBg" | "hoverBorder" | "hoverText" | "noAnim" | "padding" | "rounded" | "inverse" | "basic" | "secondary" | "tertiary" | "selected" | "transition" | "className" | "textSize" | "width" | "disabled"> & React.RefAttributes<HTMLAnchorElement>>;
export {};
