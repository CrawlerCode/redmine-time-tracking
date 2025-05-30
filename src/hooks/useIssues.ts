import { keepPreviousData as keepPreviousDataAsPlaceholderData } from "@tanstack/react-query";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

type Options = {
  enabled?: boolean;
  keepPreviousData?: boolean;
};

const useIssues = (ids: number[], search?: string, { enabled = true, keepPreviousData = false }: Options = {}) => {
  const redmineApi = useRedmineApi();

  const issuesQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["issues", ids],
    queryFn: ({ pageParam }) =>
      redmineApi.getIssues(
        {
          issueIds: ids,
          statusId: "*",
        },
        pageParam
      ),
    select: (data) => data?.pages.map((page) => page.issues).flat(),
    enabled: enabled && ids.length > 0,
    ...(keepPreviousData ? { placeholderData: keepPreviousDataAsPlaceholderData } : {}),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    autoFetchPages: true,
  });

  let issues = issuesQuery.data ?? [];

  // filter by search
  if (search) {
    issues = issues.filter((issue) => new RegExp(search, "i").test(`#${issue.id} ${issue.subject}`));
  }

  return {
    data: issues,
    isLoading: issuesQuery.isLoading,
    isError: issuesQuery.isError,
  };
};

export default useIssues;
