type WindowLocationType = "popup" | "popout" | "options" | "unknown";

export const getWindowLocationType = () => (new URLSearchParams(location.search).get("location") ?? "unknown") as WindowLocationType;

export const createPopOut = () => {
  const { width, height } = document.body.getBoundingClientRect();

  chrome.windows.create({
    url: chrome.runtime.getURL("/index.html?location=popout"),
    type: "popup",
    width: width + 14,
    height: height + 14,
    focused: true,
  });
};
