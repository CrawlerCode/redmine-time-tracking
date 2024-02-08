type WindowLocationType = "popup" | "popout" | "options" | "unknown";

export const getWindowLocationType = () => (new URLSearchParams(location.search).get("location") ?? "unknown") as WindowLocationType;

export const createPopOut = () => {
  chrome.windows.create({
    url: `chrome-extension://${chrome.runtime.id}/index.html?location=popout`,
    type: "popup",
    width: window.outerWidth,
    height: window.outerHeight,
    focused: true,
  });
};
