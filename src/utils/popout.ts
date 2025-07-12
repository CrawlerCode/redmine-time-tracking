type WindowLocationType = "popup" | "popout" | "options" | "unknown";

export const getWindowLocationType = () => (new URLSearchParams(location.search).get("location") ?? "unknown") as WindowLocationType;

export const createPopOut = () => {
  const { width, height } = document.body.getBoundingClientRect();

  chrome.windows.create({
    url: chrome.runtime.getURL("/index.html?location=popout"),
    type: "popup",
    width: Math.round(width + 14),
    height: Math.round(height + 14),
    focused: true,
  });
};
