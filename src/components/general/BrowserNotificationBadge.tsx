import { useEffect } from "react";

type PropTypes = {
  text: string;
  backgroundColor: string;
};

const BrowserNotificationBadge = ({ text, backgroundColor }: PropTypes) => {
  useEffect(() => {
    if (!chrome.action) return; // Not available in content scripts

    chrome.action.setBadgeText({
      text: text,
    });
    chrome.action.setBadgeBackgroundColor({ color: backgroundColor });
  }, [text, backgroundColor]);

  return null;
};

export default BrowserNotificationBadge;
