import { redminePaginatedInfiniteQueryOptions } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";

/**
 * Query redmine issues by search query
 */
export const redmineSearchIssuesQuery = (redmineApi: RedmineApiClient, options: Parameters<RedmineApiClient["searchIssues"]>[0]) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["redmine", "search", options],
    queryFn: ({ pageParam }) => redmineApi.searchIssues(options, pageParam),
    select: (data) => data.pages.map((page) => page.results).flat(),
  });
