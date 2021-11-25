import React from "react";
import { atom } from "jotai";

export const notificationBannerVisibleAtom = atom(false);

/**
 * A list of potential notification banners to display at the very top of the page.
 * NOTE: The layout component is currently hardcoded to support the height of
 * the checkly banner on desktop, mobile is dynamic.
 * @param {*} props
 * @returns
 */
export const NotificationBannerList = (props) => {
  return <div className="flex flex-col w-full t-0 z-50">{props.children}</div>;
};
