import { useMemo } from "react";
import { useSettings } from "../provider/SettingsProvider";

function useRedmineUrl() {
  const { settings } = useSettings();

  const currentUrl = useMemo<
    | {
        url: string;
        data?: {
          type: "issue";
          id: number;
        };
      }
    | undefined
  >(() => {
    const [_, issueId] = window.location.href.match(new RegExp(`^${settings.redmineURL}/issues/(\\d+)(\\?.*)?(#.*)?$`)) || [];

    if (issueId) {
      return { url: window.location.href, data: { type: "issue", id: Number(issueId) } };
    }
    return undefined;
  }, [settings.redmineURL]);

  return currentUrl;
}

export default useRedmineUrl;
