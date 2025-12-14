import { useDeferredValue } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useSuspenseRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

type Options = {
  enabled?: boolean;
};

export const useSuspenseIssues = (ids: number[], { enabled = true }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issuesIds = enabled ? ids : [];
  const deferredIssuesIds = useDeferredValue(issuesIds);
  const issuesQuery = useSuspenseRedminePaginatedInfiniteQuery({
    queryKey: ["issues", deferredIssuesIds],
    queryFn: ({ pageParam }) =>
      deferredIssuesIds.length > 0
        ? redmineApi.getIssues(
            {
              issueIds: deferredIssuesIds,
              statusId: "*",
            },
            pageParam
          )
        : { total_count: 0, ...pageParam, issues: [] },
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    autoFetchPages: true,
  });

  return {
    data: issuesQuery.data ?? [],
  };
};
