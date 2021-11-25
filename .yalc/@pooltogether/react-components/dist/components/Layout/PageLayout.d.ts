/// <reference types="react" />
/**
 * Default layout includes a page header, side nav for desktop screens and bottom nav for mobile
 * @param {*} props
 * @returns
 */
export declare const DefaultLayout: (props: any) => JSX.Element;
/**
 * Simple layout does not include a sidebar or mobile navigation
 * Any navigation is expected to be floating or in the header
 * @param {*} props
 * @returns
 */
export declare const SimpleLayout: (props: any) => JSX.Element;
