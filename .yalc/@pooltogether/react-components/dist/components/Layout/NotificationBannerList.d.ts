/// <reference types="react" />
export declare const notificationBannerVisibleAtom: import("jotai/esm/").Atom<boolean> & {
    write: (get: import("jotai/esm/").Getter, set: import("jotai/esm/").Setter, update: boolean | ((prev: boolean) => boolean)) => void | Promise<void>;
    onMount?: <S extends (update?: boolean | ((prev: boolean) => boolean)) => void>(setAtom: S) => void | (() => void);
} & {
    init: boolean;
};
/**
 * A list of potential notification banners to display at the very top of the page.
 * NOTE: The layout component is currently hardcoded to support the height of
 * the checkly banner on desktop, mobile is dynamic.
 * @param {*} props
 * @returns
 */
export declare const NotificationBannerList: (props: any) => JSX.Element;
