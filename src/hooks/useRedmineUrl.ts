import { useEffect, useState } from "react";
import useSettings from "./useSettings";

function useRedmineUrl() {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, issueId] = window.location.href.match(new RegExp(`^${settings.redmineURL}/issues/(\\d+)(\\?.*)?(#.*)?$`)) || [];

    if (issueId) {
      setCurrentUrl({ url: window.location.href, data: { type: "issue", id: Number(issueId) } });
    } else {
      setCurrentUrl(undefined);
    }
  }, [settings.redmineURL]);

  return currentUrl;
}

export default useRedmineUrl;
