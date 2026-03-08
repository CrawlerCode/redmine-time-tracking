import { redminePaginatedInfiniteQueryOptions } from "@/api/redmine/hooks/useRedminePaginatedInfiniteQuery";
import { RedmineApiClient } from "@/api/redmine/RedmineApiClient";
import { InvalidateQueryFilters } from "@tanstack/react-query";

const STALE_TIME = 1000 * 60;
const AUTO_REFRESH_INTERVAL = 1000 * 60 * 15;

export const redmineTimeEntriesQueries = {
  queryKey: ["redmine", "timeEntries"],
} satisfies InvalidateQueryFilters;

/**
 * Query multiple redmine time entries
 */
export const redmineTimeEntriesQuery = (redmineApi: RedmineApiClient, options: Parameters<RedmineApiClient["getTimeEntries"]>[0]) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["redmine", "timeEntries", options],
    queryFn: ({ pageParam }) => redmineApi.getTimeEntries(options, pageParam),
    select: (data) => data.pages.map((page) => page.time_entries).flat(),
    staleTime: STALE_TIME,
    refetchInterval: AUTO_REFRESH_INTERVAL,
  });
