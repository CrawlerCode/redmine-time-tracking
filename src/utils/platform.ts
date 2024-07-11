export const getPlatform = () => {
  if (navigator.userAgent.indexOf(" Edg/") !== -1) {
    return "Edge";
  } else if (navigator.userAgent.indexOf(" Chrome/") !== -1) {
    return "Chrome";
  } else if (navigator.userAgent.indexOf(" Firefox/") !== -1 || navigator.userAgent.indexOf(" Gecko/") !== -1) {
    return "Firefox";
  } else {
    return "Unknown";
  }
};
