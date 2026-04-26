import { redminePaginatedInfiniteQueryOptions } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { InvalidateQueryFilters, queryOptions } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60;
const AUTO_REFRESH_INTERVAL = 1000 * 60 * 15;

export const redmineIssuesQueries = {
  queryKey: ["redmine", "issues"],
} satisfies InvalidateQueryFilters;

/**
 * Query single redmine issue
 */
export const redmineIssueQuery = (redmineApi: RedmineApiClient, issueId: number) =>
  queryOptions({
    queryKey: ["redmine", "issues", issueId],
    queryFn: () => redmineApi.getIssue(issueId),
  });

/**
 * Query multiple redmine issues
 */
export const redmineIssuesQuery = (redmineApi: RedmineApiClient, options: Parameters<RedmineApiClient["getIssues"]>[0]) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["redmine", "issues", options],
    queryFn: ({ pageParam }) => redmineApi.getIssues(options, pageParam),
    select: (data) => data.pages.map((page) => page.issues).flat(),
    staleTime: STALE_TIME,
    refetchInterval: AUTO_REFRESH_INTERVAL,
  });
