import { useEffect, useState } from "react";
import useSettings from "./useSettings";

function useActiveRedmineTab() {
  const { settings } = useSettings();
  const [currentUrl, setCurrentUrl] = useState<
    | {
        url: string;
        data?: {
          type: "issue";
          id: number;
        };
      }
    | undefined
  >();

  useEffect(() => {
    const onActivated = () => {
      (async () => {
        const tabs = await chrome.tabs.query({ active: true, lastFocusedWindow: true, url: `${settings.redmineURL}/*` });
        const currentTab = tabs[0];
        if (currentTab?.url) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, issueId] = currentTab.url.match(new RegExp(`^${settings.redmineURL}/issues/(\\d+)$`)) || [];
          if (issueId) {
            setCurrentUrl({ url: currentTab.url, data: { type: "issue", id: Number(issueId) } });
          } else {
            setCurrentUrl({ url: currentTab.url });
          }
        } else {
          setCurrentUrl(undefined);
        }
      })();
    };

    // Initial load
    onActivated();

    // Listen to tab change
    chrome.tabs.onActivated.addListener(onActivated);
    return () => chrome.tabs.onActivated.removeListener(onActivated);
  }, [settings.redmineURL]);

  return currentUrl;
}

export default useActiveRedmineTab;
