import { RedmineApi } from "@/api/redmine";
import { useRedmineApi } from "../provider/RedmineApiProvider";
import { redminePaginatedInfiniteQueryOptions, useRedminePaginatedInfiniteQuery, useSuspenseRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

/**
 * Query options for my time entries
 */
const myTimeEntriesQueryOptions = (redmineApi: RedmineApi, from: Date, to: Date) =>
  redminePaginatedInfiniteQueryOptions({
    queryKey: ["timeEntries", from, to],
    queryFn: ({ pageParam }) => redmineApi.getAllMyTimeEntries(from, to, pageParam),
    select: (data) => data?.pages.map((page) => page.time_entries).flat(),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });

/**
 * Hook to get my time entries
 */
export const useMyTimeEntries = (from: Date, to: Date) => {
  const redmineApi = useRedmineApi();

  const entriesQuery = useRedminePaginatedInfiniteQuery({
    ...myTimeEntriesQueryOptions(redmineApi, from, to),
    autoFetchPages: true,
  });

  const entries = entriesQuery.data ?? [];

  return {
    isLoading: entriesQuery.isLoading,
    data: entries,
  };
};

/**
 * Hook to get my time entries with suspense
 */
export const useSuspenseMyTimeEntries = (from: Date, to: Date) => {
  const redmineApi = useRedmineApi();

  const entriesQuery = useSuspenseRedminePaginatedInfiniteQuery({
    ...myTimeEntriesQueryOptions(redmineApi, from, to),
    autoFetchPages: true,
  });

  return {
    data: entriesQuery.data,
  };
};
