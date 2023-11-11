import { useEffect } from "react";

type PropTypes = {
  text: string;
  backgroundColor: string;
};

const ChromeBadge = ({ text, backgroundColor }: PropTypes) => {
  useEffect(() => {
    chrome.action.setBadgeBackgroundColor({ color: backgroundColor });
  }, [backgroundColor]);

  useEffect(() => {
    chrome.action.setBadgeText({
      text: text,
    });
  }, [text]);

  return null;
};

export default ChromeBadge;
