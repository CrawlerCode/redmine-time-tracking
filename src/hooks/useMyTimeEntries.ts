import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getAllMyTimeEntries } from "../api/redmine";

const AUTO_REFRESH_DATA_INTERVAL = 1000 * 60 * 5;
const STALE_DATA_TIME = 1000 * 60;

const useMyTimeEntries = (from: Date, to: Date) => {
  const entriesQuery = useInfiniteQuery({
    queryKey: ["timeEntries", from, to],
    queryFn: ({ pageParam = 0 }) => getAllMyTimeEntries(from, to, pageParam * 100, 100),
    getNextPageParam: (lastPage, allPages) => (lastPage.length === 100 ? allPages.length : undefined),
    staleTime: STALE_DATA_TIME,
    refetchInterval: AUTO_REFRESH_DATA_INTERVAL,
  });

  // auto fetch all pages
  useEffect(() => {
    if (entriesQuery.hasNextPage && !entriesQuery.isFetchingNextPage) entriesQuery.fetchNextPage();
  }, [entriesQuery]);

  const entries = entriesQuery.data?.pages?.flat() ?? [];

  return {
    data: entries,
    isLoading: entriesQuery.isInitialLoading,
    isError: entriesQuery.isError,
  };
};

export default useMyTimeEntries;
