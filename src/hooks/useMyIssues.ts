import { keepPreviousData } from "@tanstack/react-query";
import { FilterQuery } from "../components/issues/Filter";
import { SearchQuery } from "../components/issues/Search";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

const useMyIssues = (additionalIssuesIds: number[], search: SearchQuery, filter: FilterQuery) => {
  const redmineApi = useRedmineApi();

  const issuesQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["issues", "me"],
    queryFn: ({ pageParam }) =>
      redmineApi.getOpenIssues(
        {
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
      redmineApi.getOpenIssues(
        {
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

  let issues = issuesQuery.data ?? [];
  issues.push(...(additionalIssuesQuery.data?.filter((issue) => !issues.find((iss) => iss.id === issue.id)) ?? []));

  // filter by project (search in project)
  if (search.searching && search.inProject) {
    issues = issues.filter((issue) => issue.project.id === search.inProject?.id);
  }

  // local search
  if (search.searching && search.query) {
    issues = issues.filter((issue) => new RegExp(search.query, "i").test(`#${issue.id} ${issue.subject}`));
  }

  // filter: projects
  if (filter.projects.length > 0) {
    issues = issues.filter((issue) => filter.projects.includes(issue.project.id));
  }

  // filter: hide completed issues (done_ratio = 100%)
  if (filter.hideCompletedIssues) {
    issues = issues.filter((issue) => issue.done_ratio !== 100);
  }

  return {
    data: issues,
    isLoading: issuesQuery.isLoading || additionalIssuesQuery.isLoading,
    isError: issuesQuery.isError || additionalIssuesQuery.isError,
  };
};

export default useMyIssues;
