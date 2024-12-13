import { useRedmineApi } from "../provider/RedmineApiProvider";
import { useRedminePaginatedInfiniteQuery } from "./useRedminePaginatedInfiniteQuery";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 15;
const STALE_DATA_TIME = 1000 * 60;

const useMyTimeEntries = (from: Date, to: Date) => {
  const redmineApi = useRedmineApi();

  const entriesQuery = useRedminePaginatedInfiniteQuery({
    queryKey: ["timeEntries", from, to],
    queryFn: ({ pageParam }) => redmineApi.getAllMyTimeEntries(from, to, pageParam),
    select: (data) => data?.pages.map((page) => page.time_entries).flat(),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
    autoFetchPages: true,
  });

  const entries = entriesQuery.data ?? [];

  return {
    data: entries,
    isLoading: entriesQuery.isLoading,
    isError: entriesQuery.isError,
  };
};

export default useMyTimeEntries;
