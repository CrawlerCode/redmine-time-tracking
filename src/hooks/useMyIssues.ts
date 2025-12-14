import { RedmineApi } from "@/api/redmine";
import { useDeferredValue } from "react";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { redminePaginatedInfiniteQueryOptions, useSuspenseRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

export const myOpenIssuesQueryOptions = (redmineApi: RedmineApi) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["issues", "open", "me"],
    queryFn: ({ pageParam }) =>
      redmineApi.getIssues(
        {
          statusId: "open",
          assignedTo: "me",
        },
        pageParam
      ),
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });

export const useSuspenseMyIssues = (additionalIssuesIds: number[]) => {
  const redmineApi = useRedmineApi();

  const issuesQuery = useSuspenseRedminePaginatedInfiniteQuery({
    ...myOpenIssuesQueryOptions(redmineApi),
    autoFetchPages: true,
  });
  const fetchIssuesIds = Array.from(new Set(additionalIssuesIds).difference(new Set(issuesQuery.data?.map((issue) => issue.id) ?? [])));
  const deferredFetchIssuesIds = useDeferredValue(fetchIssuesIds);
  const additionalIssuesQuery = useSuspenseRedminePaginatedInfiniteQuery({
    queryKey: ["issues", deferredFetchIssuesIds, "*"],
    queryFn: ({ pageParam }) =>
      deferredFetchIssuesIds.length > 0
        ? redmineApi.getIssues(
            {
              statusId: "*",
              issueIds: deferredFetchIssuesIds,
            },
            pageParam
          )
        : { total_count: 0, ...pageParam, issues: [] },
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    autoFetchPages: true,
  });

  const issues = issuesQuery.data ?? [];
  issues.push(...(additionalIssuesQuery.data?.filter((issue) => !issues.find((iss) => iss.id === issue.id)) ?? []));

  return {
    data: issues,
  };
};
