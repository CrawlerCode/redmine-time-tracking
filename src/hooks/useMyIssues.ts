import { keepPreviousData } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

const useMyIssues = (additionalIssuesIds: number[]) => {
  const redmineApi = useRedmineApi();

  const issuesQuery = useRedminePaginatedInfiniteQuery({
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
    autoFetchPages: true,
  });
  const additionalIssuesQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["issues", additionalIssuesIds],
    queryFn: ({ pageParam }) =>
      redmineApi.getIssues(
        {
          statusId: "*",
          issueIds: additionalIssuesIds,
        },
        pageParam
      ),
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    enabled: additionalIssuesIds.length > 0,
    placeholderData: keepPreviousData,
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    autoFetchPages: true,
  });

  const issues = issuesQuery.data ?? [];
  issues.push(...(additionalIssuesQuery.data?.filter((issue) => !issues.find((iss) => iss.id === issue.id)) ?? []));

  return {
    data: issues,
    isLoading: issuesQuery.isLoading || additionalIssuesQuery.isLoading,
    isError: issuesQuery.isError || additionalIssuesQuery.isError,
  };
};

export default useMyIssues;
