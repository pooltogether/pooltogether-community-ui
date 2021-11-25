import React from 'react';
interface LinkProps {
    as: string;
    href: string;
}
interface PageHeaderContainerProps extends LinkProps {
    Link: React.FC<LinkProps>;
    className?: string;
    children: React.ReactNode;
}
/**
 * TODO: Migrate remaining components
 * @returns
 */
export declare const PageHeaderContainer: (props: PageHeaderContainerProps) => JSX.Element;
export {};
