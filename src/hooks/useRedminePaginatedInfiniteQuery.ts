import { DefaultError, InfiniteData, Optional, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TPaginatedResponse } from "../types/redmine";

const defaultPageParam = {
  offset: 0,
  limit: 100,
};

/**
 * Hook to fetch paginated data from Redmine API using infinite query
 */
export const useRedminePaginatedInfiniteQuery = <
  TQueryFnData extends TPaginatedResponse<unknown>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData, typeof defaultPageParam>,
  TQueryKey extends QueryKey = QueryKey,
>({
  autoFetchPages = false,
  initialPageParam = defaultPageParam,
  ...options
}: Omit<Optional<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey, typeof defaultPageParam>, "initialPageParam">, "getNextPageParam" | "getPreviousPageParam"> & {
  /**
   * Automatically fetch next pages
   * - `false`: disabled
   * - `true`: enabled until there are no more pages
   * - `number`: enabled with a limit of pages to fetch
   *
   * @default false
   */
  autoFetchPages?: boolean | number;
}) => {
  const query = useInfiniteQuery({
    ...options,
    initialPageParam,
    getNextPageParam: (lastPage) => (lastPage.total_count > lastPage.offset + lastPage.limit ? { offset: lastPage.offset + lastPage.limit, limit: lastPage.limit } : undefined),
  });

  // Auto fetch pages
  const [autoFetchedPages, setAutoFetchedPages] = useState(0);
  useEffect(() => {
    // Disabled or nothing to fetch
    if (!autoFetchPages || !query.hasNextPage || query.isFetchingNextPage) return;

    // No more pages to fetch (limit reached)
    if (typeof autoFetchPages === "number" && autoFetchedPages >= autoFetchPages) return;

    // Fetch next page
    query.fetchNextPage();
    setAutoFetchedPages((prev) => prev + 1);
  }, [query, autoFetchPages, autoFetchedPages]);

  return query;
};
