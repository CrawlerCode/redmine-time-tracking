import { browser } from "wxt/browser";

export const createPopOut = () => {
  const { width, height } = document.body.getBoundingClientRect();

  browser.windows.create({
    url: browser.runtime.getURL("/index.html"),
    type: "popup",
    width: Math.round(width + 14),
    height: Math.round(height + 14),
    focused: true,
  });
};
