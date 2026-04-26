import { useEffect } from "react";
import { browser } from "wxt/browser";

type PropTypes = {
  text: string;
  backgroundColor: string;
};

const BrowserNotificationBadge = ({ text, backgroundColor }: PropTypes) => {
  useEffect(() => {
    if (!browser.action) return; // Not available in content scripts

    browser.action.setBadgeText({
      text: text,
    });
    browser.action.setBadgeBackgroundColor({ color: backgroundColor });
  }, [text, backgroundColor]);

  return null;
};

export default BrowserNotificationBadge;
