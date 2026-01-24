import {
  DefaultError,
  InfiniteData,
  infiniteQueryOptions,
  QueryKey,
  UnusedSkipTokenInfiniteOptions,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  useSuspenseInfiniteQuery,
  UseSuspenseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TPaginatedResponse } from "../api/redmine/types";

const defaultInitialPageParam = {
  offset: 0,
  limit: 100,
};

export const redminePaginatedInfiniteQueryOptions = <
  TQueryFnData extends TPaginatedResponse<unknown>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData, typeof defaultInitialPageParam>,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: Omit<UnusedSkipTokenInfiniteOptions<TQueryFnData, TError, TData, TQueryKey, typeof defaultInitialPageParam>, "initialPageParam" | "getNextPageParam" | "getPreviousPageParam">
) =>
  infiniteQueryOptions({
    initialPageParam: defaultInitialPageParam,
    getNextPageParam: (lastPage) => (lastPage.total_count > lastPage.offset + lastPage.limit ? { offset: lastPage.offset + lastPage.limit, limit: lastPage.limit } : undefined),
    ...options,
  });

/**
 * Hook to fetch paginated data from Redmine API using infinite query
 */
export const useRedminePaginatedInfiniteQuery = <
  TQueryFnData extends TPaginatedResponse<unknown>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData, typeof defaultInitialPageParam>,
  TQueryKey extends QueryKey = QueryKey,
>({
  autoFetchPages = false,
  ...options
}: Omit<UseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, typeof defaultInitialPageParam>, "initialPageParam" | "getNextPageParam" | "getPreviousPageParam"> & {
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
    initialPageParam: defaultInitialPageParam,
    getNextPageParam: (lastPage) => (lastPage.total_count > lastPage.offset + lastPage.limit ? { offset: lastPage.offset + lastPage.limit, limit: lastPage.limit } : undefined),
    ...options,
  });

  // Auto fetch pages
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const { enabled } = options;
  const [autoFetchedPages, setAutoFetchedPages] = useState(0);
  useEffect(() => {
    // Disabled or nothing to fetch
    if (!enabled || !autoFetchPages || !hasNextPage || isFetchingNextPage) return;

    // No more pages to fetch (limit reached)
    if (typeof autoFetchPages === "number" && autoFetchedPages >= autoFetchPages) return;

    // Fetch next page and increment counter after the fetch completes
    fetchNextPage().then(() => {
      setAutoFetchedPages((prev) => prev + 1);
    });
  }, [enabled, hasNextPage, isFetchingNextPage, fetchNextPage, autoFetchPages, autoFetchedPages]);

  return query;
};

/**
 * Hook to fetch paginated data from Redmine API using infinite query
 */
export const useSuspenseRedminePaginatedInfiniteQuery = <
  TQueryFnData extends TPaginatedResponse<unknown>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData, typeof defaultInitialPageParam>,
  TQueryKey extends QueryKey = QueryKey,
>({
  autoFetchPages = false,
  ...options
}: Omit<UseSuspenseInfiniteQueryOptions<TQueryFnData, TError, TData, TQueryKey, typeof defaultInitialPageParam>, "initialPageParam" | "getNextPageParam" | "getPreviousPageParam"> & {
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
  const query = useSuspenseInfiniteQuery({
    initialPageParam: defaultInitialPageParam,
    getNextPageParam: (lastPage) => (lastPage.total_count > lastPage.offset + lastPage.limit ? { offset: lastPage.offset + lastPage.limit, limit: lastPage.limit } : undefined),
    ...options,
  });

  // Auto fetch pages
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = query;
  const [autoFetchedPages, setAutoFetchedPages] = useState(0);
  useEffect(() => {
    // Disabled or nothing to fetch
    if (!autoFetchPages || !hasNextPage || isFetchingNextPage) return;

    // No more pages to fetch (limit reached)
    if (typeof autoFetchPages === "number" && autoFetchedPages >= autoFetchPages) return;

    // Fetch next page
    fetchNextPage().then(() => {
      setAutoFetchedPages((prev) => prev + 1);
    });
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, autoFetchPages, autoFetchedPages]);

  return query;
};
