import React, { useState } from "react";
import classnames from "classnames";
import FeatherIcon from "feather-icons-react";

export const NotificationBannerContainer = (props) => {
  const { canClose } = props;

  const [userHasClosedBanner, setUserHasClosedBanner] = useState(false);

  if (userHasClosedBanner) return null;

  return (
    <div
      className={classnames("z-50 flex relative", props.className, {
        "text-center": !props.noCenter,
      })}
    >
      <div className="max-w-screen-lg sm:px-6 py-2 sm:py-3 mx-auto flex-grow px-8">
        {props.children}
      </div>
      {canClose && (
        <CloseBannerButton closeBanner={() => setUserHasClosedBanner(true)} />
      )}
    </div>
  );
};

const CloseBannerButton = (props) => (
  <button
    className="absolute r-1 t-1 opacity-70 hover:opacity-100 cursor-pointer trans"
    onClick={() => props.closeBanner()}
  >
    <FeatherIcon icon="x" className="h-4 w-4 sm:h-6 sm:w-6" />
  </button>
);
